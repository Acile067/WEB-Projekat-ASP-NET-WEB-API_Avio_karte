using ASP_NET_WEB_API_Avio_Karte.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace ASP_NET_WEB_API_Avio_Karte.Controllers
{
    public class RezervacijaController : ApiController
    {

        //POST /api/rezervacija REGISTRATION
        public IHttpActionResult Post(Rezervacija r)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var let = Data.Letovi.Find(l => l.Id == r.LetId);
            if (let == null)
            {
                return BadRequest("Invalid LetId");
            }

            r.UkupnaCena = let.Cena * r.BrojPutnika;
            r.Status = Status.Kreirana;

            

            // Pronalaženje korisnika po korisničkom imenu
            var korisnik = Data.Putnici.GetList().FirstOrDefault(k => k.KorisnickoIme == r.Korisnik);
            if (korisnik == null)
            {
                return BadRequest("Korisnik nije pronađen.");
            }

            var maxId = Data.Rezervacije.GetList().Count > 0 ? Data.Rezervacije.Max(x => x.Id) : 0;
            r.Id = maxId + 1;

            Data.Rezervacije.Add(new Rezervacija(r));

            let.AddRezervacija(r);

            var aviokompanija = Data.Aviokompanije.Find(a => a.Id == let.AviokompanijaId);
            if (aviokompanija != null)
            {
                var index = aviokompanija.Letovi.FindIndex(l => l.Id == let.Id);
                if (index != -1)
                {
                    aviokompanija.Letovi[index] = let;
                    Data.Aviokompanije.Update(aviokompanija);
                }
            }

            korisnik.Rezervacije.Add(r);
            Data.Putnici.Update(korisnik);

            return Created("Rezervacija", r.Id);
        }

        // GET /api/neodobrene
        [HttpGet, Route("api/neodobrene")]
        public IHttpActionResult GetAllNeodobrene()
        {
            var neodobrene = Data.Rezervacije.GetList()
                            .Where(p => p.Status == Status.Kreirana)
                            .Select(p => (Rezervacija)p);


            return Ok(neodobrene.ToList());
        }
        // GET /api/odobrene
        [HttpGet, Route("api/odobrene")]
        public IHttpActionResult GetAllOdobrene()
        {
            var odobrene = Data.Rezervacije.GetList()
                            .Where(p => p.Status == Status.Odobrena)
                            .Select(p => (Rezervacija)p);


            return Ok(odobrene.ToList());
        }

        // GET /api/zavrseneotkazane
        [HttpGet, Route("api/zavrseneotkazane")]
        public IHttpActionResult GetAllZavrseneOtkazane()
        {
            var zavrseneotkazane = Data.Rezervacije.GetList()
                            .Where(p => p.Status == Status.Otkazana || p.Status == Status.Zavrsena)
                            .Select(p => (Rezervacija)p);


            return Ok(zavrseneotkazane.ToList());
        }

        // GET /api/neodobrena/{id}
        [HttpGet, Route("api/neodobrena/{id}")]
        public IHttpActionResult GetNeodobrena(int id)
        {
            var neodobrena = Data.Rezervacije.Find(p => p.Id == id);
            if (neodobrena == null || neodobrena.Status != 0)
            {
                return NotFound();
            }

            return Ok(neodobrena);
        }

        // GET /api/odobrena/{id}
        [HttpGet, Route("api/odobrena/{id}")]
        public IHttpActionResult GetOdobrena(int id)
        {
            var odobrena = Data.Rezervacije.Find(p => p.Id == id);
            if (odobrena == null)
            {
                return NotFound();
            }

            return Ok(odobrena);
        }

        // PUT /api/odobrirezervaciju/{id}

        [HttpPut, Route("api/odobrirezervaciju/{id}")]
        public IHttpActionResult PutOdobriRezervaciju(int id, Rezervacija rezervacijaZaPromenu)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Pronalaženje rezervacije u memoriji ili bazi podataka
            var rezervacija = Data.Rezervacije.Find(p => p.Id == id);
            if (rezervacija == null)
                return BadRequest($"Rezervacija sa ID {id} nije pronađena.");

            if (rezervacija.Status != Status.Kreirana)
                return BadRequest($"Rezervacija sa ID {id} nije u stanju 'Kreirana'.");

            // Ažuriranje statusa rezervacije
            rezervacija.Status = Status.Odobrena;
            Data.Rezervacije.Update(rezervacija);

            // Pronalaženje leta koji sadrži rezervaciju
            var let = Data.Letovi.Find(l => l.Id == rezervacija.LetId);
            if (let == null)
                return BadRequest($"Let sa ID {rezervacija.LetId} nije pronađen.");

            // Pronalaženje rezervacije u letovima i ažuriranje statusa
            var rezervacijaLet = let.Rezervacije.FirstOrDefault(r => r.Id == id);
            if (rezervacijaLet == null)
                return BadRequest($"Rezervacija sa ID {id} nije pronađena u letu sa ID {rezervacija.LetId}.");

            rezervacijaLet.Status = Status.Odobrena;
            Data.Letovi.Update(let);

            // Ažuriranje aviokompanije
            var aviokompanija = Data.Aviokompanije.Find(ak => ak.Id == let.AviokompanijaId);
            if (aviokompanija != null)
            {
                // Pronalaženje leta u aviokompaniji i ažuriranje rezervacije
                var letAviokompanija = aviokompanija.Letovi.FirstOrDefault(l => l.Id == let.Id);
                if (letAviokompanija != null)
                {
                    var rezervacijaAviokompanija = letAviokompanija.Rezervacije.FirstOrDefault(r => r.Id == id);
                    if (rezervacijaAviokompanija != null)
                    {
                        rezervacijaAviokompanija.Status = Status.Odobrena;
                        Data.Aviokompanije.Update(aviokompanija);
                    }
                }
            }

            // Ažuriranje XML fajla za putnike
            var putnik = Data.Putnici.GetList().FirstOrDefault(p => p.KorisnickoIme == rezervacija.Korisnik);
            if (putnik != null)
            {
                var rezervacijaPutnika = putnik.Rezervacije.FirstOrDefault(r => r.Id == id);
                if (rezervacijaPutnika != null)
                {
                    rezervacijaPutnika.Status = Status.Odobrena;
                    Data.Putnici.Update(putnik);
                }
            }

            return Ok(rezervacija);
        }

        // PUT /api/otkazirezervaciju/{id}

        [HttpPut, Route("api/otkazirezervaciju/{id}")]
        public IHttpActionResult PutOtkaziRezervaciju(int id, Rezervacija rezervacijaZaPromenu)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Pronalaženje rezervacije u memoriji ili bazi podataka
            var rezervacija = Data.Rezervacije.Find(p => p.Id == id);
            if (rezervacija == null)
                return BadRequest($"Rezervacija sa ID {id} nije pronađena.");

            // Ažuriranje statusa rezervacije
            rezervacija.Status = Status.Otkazana;
            Data.Rezervacije.Update(rezervacija);

            // Pronalaženje leta koji sadrži rezervaciju
            var let = Data.Letovi.Find(l => l.Id == rezervacija.LetId);
            if (let == null)
                return BadRequest($"Let sa ID {rezervacija.LetId} nije pronađen.");

            // Pronalaženje rezervacije u letovima i ažuriranje statusa
            var rezervacijaLet = let.Rezervacije.FirstOrDefault(r => r.Id == id);
            if (rezervacijaLet == null)
                return BadRequest($"Rezervacija sa ID {id} nije pronađena u letu sa ID {rezervacija.LetId}.");

            rezervacijaLet.Status = Status.Otkazana;
            Data.Letovi.Update(let);

            // Ažuriranje aviokompanije
            var aviokompanija = Data.Aviokompanije.Find(ak => ak.Id == let.AviokompanijaId);
            if (aviokompanija != null)
            {
                // Pronalaženje leta u aviokompaniji i ažuriranje rezervacije
                var letAviokompanija = aviokompanija.Letovi.FirstOrDefault(l => l.Id == let.Id);
                if (letAviokompanija != null)
                {
                    var rezervacijaAviokompanija = letAviokompanija.Rezervacije.FirstOrDefault(r => r.Id == id);
                    if (rezervacijaAviokompanija != null)
                    {
                        rezervacijaAviokompanija.Status = Status.Otkazana;
                        Data.Aviokompanije.Update(aviokompanija);
                    }
                }
            }

            // Ažuriranje XML fajla za putnike
            var putnik = Data.Putnici.GetList().FirstOrDefault(p => p.KorisnickoIme == rezervacija.Korisnik);
            if (putnik != null)
            {
                var rezervacijaPutnika = putnik.Rezervacije.FirstOrDefault(r => r.Id == id);
                if (rezervacijaPutnika != null)
                {
                    rezervacijaPutnika.Status = Status.Otkazana;
                    Data.Putnici.Update(putnik);
                }
            }

            return Ok(rezervacija);
        }

        [HttpGet, Route("api/recenzijeinfo/{korisnickoime}")]
        public IHttpActionResult GetAllRecenzijeForUser(string korisnickoime)
        {
            if (string.IsNullOrEmpty(korisnickoime))
            {
                return BadRequest("Korisničko ime nije validno.");
            }

            var putnik = Data.Putnici.GetList().FirstOrDefault(p => p.KorisnickoIme == korisnickoime);

            if (putnik == null)
            {
                return NotFound();
            }

            var rezervacije = putnik.Rezervacije;

            if (rezervacije == null || !rezervacije.Any())
            {
                return NotFound();
            }

            return Ok(rezervacije.ToList());
        }
    }
}
