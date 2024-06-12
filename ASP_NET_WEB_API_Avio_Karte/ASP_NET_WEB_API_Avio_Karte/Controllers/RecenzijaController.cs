using ASP_NET_WEB_API_Avio_Karte.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace ASP_NET_WEB_API_Avio_Karte.Controllers
{
    public class RecenzijaController : ApiController
    {

        //POST /api/recenzija REGISTRATION
        [HttpPost, Route("api/recenzija")]
        public IHttpActionResult Post()
        {
            var httpRequest = HttpContext.Current.Request;

            var maxId = Data.Recenzije.GetList().Count > 0 ? Data.Recenzije.GetList().Max(x => x.Id) : 0;
            var maxIdand1 = maxId + 1;
            // Proverite da li postoje fajlovi u zahtevu
            string slikaPath = null;
            if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];
                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(postedFile.FileName); // Jedinstveno ime za fajl
                    string filePath = HttpContext.Current.Server.MapPath("~/Uploads/") + maxIdand1 + fileName;
                    postedFile.SaveAs(filePath);
                    slikaPath = "../Uploads/" + maxIdand1 + fileName ; // Relativna putanja za čuvanje u bazi
                }
            }

            // Čitajte ostale podatke iz forme
            int letId = int.Parse(httpRequest.Form["letid"]);
            string korisnik = httpRequest.Form["korisnik"];
            string naslov = httpRequest.Form["naslov"];
            string sadrzaj = httpRequest.Form["sadrzaj"];
            int ocena = int.Parse(httpRequest.Form["ocena"]);

            var let = Data.Letovi.Find(p => p.Id == letId);
            if (let == null || let.Obrisan == "Da")
            {
                return NotFound();
            }

            var aviokompanija = Data.Aviokompanije.Find(p => p.Id == let.AviokompanijaId);
            if (aviokompanija == null || aviokompanija.Obrisana == "Da")
            {
                return NotFound();
            }


            var recenzija = new Recenzija
            {
                Id = maxId + 1,
                LetId = letId,
                Korisnik = korisnik,
                Aviokompanija = let.Aviokompanija,
                Naslov = naslov,
                Sadrzaj = sadrzaj,
                Ocena = ocena,
                Slika = slikaPath,
                StatusRecenzije = StatusRecenzije.Kreirana
            };

            var putnik = Data.Putnici.GetList().FirstOrDefault(k => k.KorisnickoIme == korisnik);
            if (putnik == null)
            {
                return BadRequest("Korisnik nije pronađen.");
            }

            aviokompanija.Recenzije.Add(recenzija);
            Data.Aviokompanije.Update(aviokompanija);

            putnik.Recenzije.Add(recenzija);
            Data.Putnici.Update(putnik);

            Data.Recenzije.Add(recenzija);
            return Created("Recenzija", recenzija.Id);
        }

        // GET /api/kreiranerecenzije
        [HttpGet, Route("api/kreiranerecenzije")]
        public IHttpActionResult GetAllKreirane()
        {
            var kreirane = Data.Recenzije.GetList()
                            .Where(p => p.StatusRecenzije == StatusRecenzije.Kreirana)
                            .Select(p => (Recenzija)p);


            return Ok(kreirane.ToList());
        }

        // GET /api/kreiranerecenzije
        [HttpGet, Route("api/odobreneodbijenerecenzije")]
        public IHttpActionResult GetAllOdobreneOdbijene()
        {
            var kreirane = Data.Recenzije.GetList()
                            .Where(p => p.StatusRecenzije == StatusRecenzije.Odobrena || p.StatusRecenzije == StatusRecenzije.Odbijena)
                            .Select(p => (Recenzija)p);


            return Ok(kreirane.ToList());
        }

        // PUT /api/recenzija/{id}/status
        [HttpPut, Route("api/recenzija/{id}/status")]
        public IHttpActionResult UpdateStatus(int id, [FromBody] StatusUpdateRequest request)
        {
            // Validacija statusa
            if (!Enum.TryParse(request.Status, out StatusRecenzije newStatus))
            {
                return BadRequest("Neispravan status.");
            }

            // Ažuriranje statusa u recenzije.xml
            var recenzija = Data.Recenzije.GetList().FirstOrDefault(r => r.Id == id);
            if (recenzija == null)
            {
                return NotFound();
            }
            recenzija.StatusRecenzije = newStatus;
            Data.Recenzije.Update(recenzija);

            // Ažuriranje statusa u aviokompanije.xml
            var aviokompanija = Data.Aviokompanije.GetList().FirstOrDefault(k => k.Naziv == recenzija.Aviokompanija);
            if (aviokompanija == null)
            {
                return BadRequest("Aviokompanija nije pronađena.");
            }

            var aviokompanijaRecenzija = aviokompanija.Recenzije.FirstOrDefault(r => r.Id == id);
            if (aviokompanijaRecenzija != null)
            {
                aviokompanijaRecenzija.StatusRecenzije = newStatus;
                Data.Aviokompanije.Update(aviokompanija);
            }
            else
            {
                return NotFound();
            }

            // Ažuriranje statusa u putnici.xml
            var putnik = Data.Putnici.GetList().FirstOrDefault(k => k.KorisnickoIme == recenzija.Korisnik);
            if (putnik == null)
            {
                return BadRequest("Korisnik nije pronađen.");
            }

            var putnikRecenzija = putnik.Recenzije.FirstOrDefault(r => r.Id == id);
            if (putnikRecenzija != null)
            {
                putnikRecenzija.StatusRecenzije = newStatus;
                Data.Putnici.Update(putnik);
            }
            else
            {
                return NotFound();
            }

            return Ok("Status recenzije uspešno ažuriran.");
        }

    }

    public class StatusUpdateRequest
    {
        public string Status { get; set; }
    }
}
