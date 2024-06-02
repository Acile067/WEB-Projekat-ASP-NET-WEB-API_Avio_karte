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
        public IHttpActionResult GetAllUsers(string polaznadestinacija = null, string odredistnadestinacija = null, string datumpolaska = null, string datumdolaska = null)
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

            return Ok(letovi.ToList());
        }
    }
}
