using ASP_NET_WEB_API_Avio_Karte.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ASP_NET_WEB_API_Avio_Karte.Controllers
{
    public class AviokompanijaController : ApiController
    {
        private bool CheckIfExists(string naziv, string email)
        {
            return Data.Aviokompanije.Find(u => u.Naziv == naziv && u.Email == email) != null;
        }

        //POST /api/aviokompanija REGISTRATION
        public IHttpActionResult Post(Aviokompanija a)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (CheckIfExists(a.Naziv, a.Email))
                return BadRequest("Aviokompanija vec postoji");

            var maxId = Data.Aviokompanije.GetList().Count > 0 ? Data.Aviokompanije.GetList().Max(x => x.Id) : 0;
            a.Id = maxId + 1;

            Data.Aviokompanije.Add(new Aviokompanija(a));
            return Created("Aviokompanija", a.Naziv);
        }

        // GET /api/aviokompanije
        [HttpGet, Route("api/aviokompanije")]
        public IHttpActionResult GetAllUsers(string naziv = null, string adresa = null, string telefon = null, string email = null)
        {
            var aviokompanije = Data.Aviokompanije.GetList()
                            .Where(p => p.Obrisana != "Da") 
                            .Select(p => (Aviokompanija)p);

            // Filtriranje korisnika prema unetim parametrima pretrage
            if (!string.IsNullOrWhiteSpace(naziv))
                aviokompanije = aviokompanije.Where(p => p.Naziv.ToLower().Contains(naziv.ToLower()));
            if (!string.IsNullOrWhiteSpace(adresa))
                aviokompanije = aviokompanije.Where(p => p.Adresa.ToLower().Contains(adresa.ToLower()));
            if (!string.IsNullOrWhiteSpace(telefon))
                aviokompanije = aviokompanije.Where(p => p.Telefon.ToLower().Contains(telefon.ToLower()));
            if (!string.IsNullOrWhiteSpace(email))
                aviokompanije = aviokompanije.Where(p => p.Email.ToLower().Contains(email.ToLower()));


            return Ok(aviokompanije.ToList());
        }
        // GET /api/aviokompanija/{id}
        [HttpGet, Route("api/aviokompanija/{id}")]
        public IHttpActionResult GetAviokompanija(int id)
        {
            var aviokompanija = Data.Aviokompanije.Find(p => p.Id == id);
            if (aviokompanija == null || aviokompanija.Obrisana == "Da")
            {
                return NotFound();
            }

            return Ok(aviokompanija);
        }

        // PUT /api/aviokompanija/{id}
        [HttpPut, Route("api/aviokompanija/{id}")]
        public IHttpActionResult PutAviokompanija(int id, Aviokompanija a)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var aviokompanija = Data.Aviokompanije.Find(p => p.Id == id);
            if (aviokompanija == null || aviokompanija.Obrisana == "Da")
                return NotFound();

            aviokompanija.Naziv = a.Naziv;
            aviokompanija.Adresa = a.Adresa;
            aviokompanija.Telefon = a.Telefon;
            aviokompanija.Email = a.Email;

            Data.Aviokompanije.Update(aviokompanija); 

            return Ok(aviokompanija);
        }
        // DELETE /api/aviokompanija/{id}
        [HttpDelete, Route("api/aviokompanija/{id}")]
        public IHttpActionResult DeleteAviokompanija(int id)
        {
            var aviokompanija = Data.Aviokompanije.Find(p => p.Id == id);
            if (aviokompanija == null)
                return NotFound();

            foreach (var let in aviokompanija.Letovi)
            {
                // Ako je status leta "Aktivan", ne dozvoljavamo brisanje
                if (let.StatusLeta == StatusLeta.Aktivan)
                {
                    return BadRequest("Aviokompanija ne može biti obrisana jer ima aktivne letove.");
                }
            }

            aviokompanija.Obrisana = "Da";
            Data.Aviokompanije.UpdateFile();
            return Ok();
        }

        // GET /api/nazivaviokompanija
        [HttpGet, Route("api/nazivaviokompanija")]
        public IHttpActionResult GetAllAviokompanije()
        {
            var aviokompanije = Data.Aviokompanije.GetList()
                                .Where(a => a.Obrisana != "Da")
                                .Select(a => new { a.Id, a.Naziv })
                                .ToList();

            return Ok(aviokompanije);
        }

        // GET /api/aviokompanijaLetId/{id}
        [HttpGet, Route("api/aviokompanijaLetId/{letid}")]
        public IHttpActionResult GetAviokompanijaIzLetId(int letid)
        {
            var let = Data.Letovi.Find(p => p.Id == letid);
            if (let == null || let.Obrisan == "Da")
            {
                return NotFound();
            }

            var aviokompanija = Data.Aviokompanije.Find(p => p.Id == let.AviokompanijaId);
            if (aviokompanija == null || aviokompanija.Obrisana == "Da")
            {
                return NotFound();
            }

            return Ok(aviokompanija);
        }
    }
}
