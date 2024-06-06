using ASP_NET_WEB_API_Avio_Karte.Models;
using System.Globalization;
using System;
using System.Linq;
using System.Web.Http;

namespace ASP_NET_WEB_API_Avio_Karte.Controllers
{
    public class LetController : ApiController
    {
        // POST /api/let REGISTRATION
        public IHttpActionResult Post(Let l)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            DateTime dateTime;
            if (DateTime.TryParse(l.DatumDolaska, out dateTime))
                l.DatumDolaska = dateTime.ToString("dd/MM/yyyy");

            DateTime dateTime2;
            if (DateTime.TryParse(l.DatumPolaska, out dateTime2))
                l.DatumPolaska = dateTime2.ToString("dd/MM/yyyy");

            // Generisanje novog ID-a za let
            var maxId = Data.Letovi.GetList().Count > 0 ? Data.Letovi.Max(x => x.Id) : 0;
            l.Id = maxId + 1;

            // Pronalaženje aviokompanije po ID-u
            var aviokompanija = Data.Aviokompanije.GetList().FirstOrDefault(a => a.Id == l.AviokompanijaId);

            if (aviokompanija == null)
                return BadRequest("Aviokompanija ne postoji");

            // Postavljanje naziva aviokompanije
            l.Aviokompanija = aviokompanija.Naziv;
            l.Obrisan = "Ne";
            

            // Dodavanje leta u listu letova aviokompanije
            aviokompanija.Letovi.Add(l);
            Data.Aviokompanije.Update(aviokompanija); // Ažuriranje aviokompanije u datoteci

            Data.Letovi.Add(new Let(l));

            return Created("Let", l.Id);
        }

        // GET /api/letovi
        [HttpGet, Route("api/letovi")]
        public IHttpActionResult GetAllUsers(string polaznadestinacija = null, string odredistnadestinacija = null, string datumpolaska = null, string datumdolaska = null, string aviokompanija = null)
        {
            var letovi = Data.Letovi.GetList()
                            .Where(p => p.Obrisan != "Da")
                            .Select(p => (Let)p);

            // Filtriranje korisnika prema unetim parametrima pretrage
            if (!string.IsNullOrWhiteSpace(polaznadestinacija))
                letovi = letovi.Where(p => p.PolaznaDestinacija.ToLower().Contains(polaznadestinacija.ToLower()));
            if (!string.IsNullOrWhiteSpace(odredistnadestinacija))
                letovi = letovi.Where(p => p.OdredistnaDestinacija.ToLower().Contains(odredistnadestinacija.ToLower()));
            if (!string.IsNullOrWhiteSpace(datumpolaska))
            {
                DateTime datumOdDate;
                if (DateTime.TryParse(datumpolaska, out datumOdDate))
                    letovi = letovi.Where(p => DateTime.ParseExact(p.DatumPolaska, "dd/MM/yyyy", CultureInfo.InvariantCulture) >= datumOdDate);
            }
            if (!string.IsNullOrWhiteSpace(datumdolaska))
            {
                DateTime datumOdDate;
                if (DateTime.TryParse(datumdolaska, out datumOdDate))
                    letovi = letovi.Where(p => DateTime.ParseExact(p.DatumDolaska, "dd/MM/yyyy", CultureInfo.InvariantCulture) <= datumOdDate);
            }
            if (!string.IsNullOrWhiteSpace(aviokompanija))
                letovi = letovi.Where(p => p.Aviokompanija.ToLower().Contains(aviokompanija.ToLower()));

            return Ok(letovi.ToList());
        }

        // GET /api/let/{id}
        [HttpGet, Route("api/let/{id}")]
        public IHttpActionResult GetAviokompanija(int id)
        {
            var let = Data.Letovi.Find(p => p.Id == id);
            if (let == null || let.Obrisan == "Da")
            {
                return NotFound();
            }

            return Ok(let);
        }

        // PUT /api/let/{id}
        [HttpPut, Route("api/let/{id}")]
        public IHttpActionResult PutLet(int id, Let l)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var let = Data.Letovi.Find(p => p.Id == id);
            if (let == null || let.Obrisan == "Da")
                return NotFound();

            if (let.AviokompanijaId != l.AviokompanijaId)
            {
                // Find the old and new Aviokompanija
                var oldAviokompanija = Data.Aviokompanije.GetList().FirstOrDefault(a => a.Id == let.AviokompanijaId);
                var newAviokompanija = Data.Aviokompanije.GetList().FirstOrDefault(a => a.Id == l.AviokompanijaId);

                if (newAviokompanija == null)
                    return BadRequest("New Aviokompanija does not exist");

                // Remove the Let from the old Aviokompanija
                if (oldAviokompanija != null)
                {
                    var letToRemove = oldAviokompanija.Letovi.FirstOrDefault(f => f.Id == let.Id);
                    if (letToRemove != null)
                    {
                        oldAviokompanija.Letovi.Remove(letToRemove);
                        Data.Aviokompanije.Update(oldAviokompanija);
                    }
                }

                // Update the AviokompanijaId and Aviokompanija fields
                let.AviokompanijaId = l.AviokompanijaId;
                let.Aviokompanija = newAviokompanija.Naziv;

                // Add the Let to the new Aviokompanija
                newAviokompanija.Letovi.Add(let);
                Data.Aviokompanije.Update(newAviokompanija);
            }

            // Convert and update the date fields
            DateTime dateTimePolaska;
            if (DateTime.TryParse(l.DatumPolaska, out dateTimePolaska))
                let.DatumPolaska = dateTimePolaska.ToString("dd/MM/yyyy");

            DateTime dateTimeDolaska;
            if (DateTime.TryParse(l.DatumDolaska, out dateTimeDolaska))
                let.DatumDolaska = dateTimeDolaska.ToString("dd/MM/yyyy");

            let.VremePolaska = l.VremePolaska;
            let.VremeDolaska = l.VremeDolaska;
            let.BrojSlobodnihMesta = l.BrojSlobodnihMesta;
            let.BrojZauzetihMesta = l.BrojZauzetihMesta;
            let.Cena = l.Cena;
            let.StatusLeta = l.StatusLeta;

            Data.Letovi.Update(let);

            return Ok(let);
        }

        // DELETE /api/let/{id}
        [HttpDelete, Route("api/let/{id}")]
        public IHttpActionResult DeleteLet(int id)
        {
            var let = Data.Letovi.Find(p => p.Id == id);
            if (let == null)
                return NotFound();

            //Treba proveriti listu rezervacija pre brisanja

            let.Obrisan = "Da";
            Data.Letovi.UpdateFile();

            var aviokompanija = Data.Aviokompanije.GetList().FirstOrDefault(a => a.Id == let.AviokompanijaId);
            if (aviokompanija != null)
            {
                // Find and update the Let in the Aviokompanija's Letovi list
                var letInAviokompanija = aviokompanija.Letovi.FirstOrDefault(l => l.Id == let.Id);
                if (letInAviokompanija != null)
                {
                    letInAviokompanija.Obrisan = "Da";
                    Data.Aviokompanije.Update(aviokompanija);
                }
            }


            return Ok();
        }
    }
}
