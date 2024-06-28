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

        // POST /api/rezervacija REGISTRATION
        [HttpPost, Route("api/rezervacija")]
        public IHttpActionResult Post(Rezervacija r)
        {
            var request = HttpContext.Current.Request;
            var authorization = request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest("Autorizacija je obavezna");
            }

            string token = authorization.Substring("Bearer ".Length).Trim();

            if (!Data.LoggedWithToken.ContainsKey(token))
            {
                return BadRequest("Neispravan token");
            }

            // Provera da li je token važeći
            var user = Data.LoggedWithToken[token];
            if (user == null || user.KorisnickoIme != r.Korisnik)
            {
                return BadRequest("Neovlašćeni korisnik");
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var let = Data.Letovi.Find(l => l.Id == r.LetId);
            if (let == null || let.Obrisan == "Da")
            {
                return BadRequest("Invalid LetId");
            }

            if(let.BrojSlobodnihMesta < r.BrojPutnika)
            {
                return BadRequest("Ne mozete rezervisati vise mesta nego sto ima slobodnih mesta");
            }

            if(let.BrojSlobodnihMesta == 0)
            {
                return BadRequest("Nema vise slobodnih mesta");
            }

            if(let.StatusLeta != StatusLeta.Aktivan)
            {
                return BadRequest("Ovo nije aktivan let");
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
            var request = HttpContext.Current.Request;
            var authorization = request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest("Autorizacija je obavezna");
            }

            string token = authorization.Substring("Bearer ".Length).Trim();

            if (!Data.LoggedWithToken.ContainsKey(token))
            {
                return BadRequest("Neispravan token");
            }

            // Provera da li je token važeći
            var user = Data.LoggedWithToken[token];
            if (user == null || user.TipKorisnika != TipKorisnika.Administrator)
            {
                return BadRequest("Neovlašćen pristup");
            }

            var neodobrene = Data.Rezervacije.GetList()
                            .Where(p => p.Status == Status.Kreirana)
                            .Select(p => (Rezervacija)p);

            return Ok(neodobrene.ToList());
        }

        // GET /api/odobrene
        [HttpGet, Route("api/odobrene")]
        public IHttpActionResult GetAllOdobrene()
        {
            var request = HttpContext.Current.Request;
            var authorization = request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest("Autorizacija je obavezna");
            }

            string token = authorization.Substring("Bearer ".Length).Trim();

            if (!Data.LoggedWithToken.ContainsKey(token))
            {
                return BadRequest("Neispravan token");
            }

            // Provera da li je token važeći
            var user = Data.LoggedWithToken[token];
            if (user == null || user.TipKorisnika != TipKorisnika.Administrator)
            {
                return BadRequest("Neovlašćen pristup");
            }

            var odobrene = Data.Rezervacije.GetList()
                            .Where(p => p.Status == Status.Odobrena)
                            .Select(p => (Rezervacija)p);

            return Ok(odobrene.ToList());
        }


        // GET /api/zavrseneotkazane
        [HttpGet, Route("api/zavrseneotkazane")]
        public IHttpActionResult GetAllZavrseneOtkazane()
        {
            var request = HttpContext.Current.Request;
            var authorization = request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest("Autorizacija je obavezna");
            }

            string token = authorization.Substring("Bearer ".Length).Trim();

            if (!Data.LoggedWithToken.ContainsKey(token))
            {
                return BadRequest("Neispravan token");
            }

            // Provera da li je token važeći
            var user = Data.LoggedWithToken[token];
            if (user == null || user.TipKorisnika != TipKorisnika.Administrator)
            {
                return BadRequest("Neovlašćen pristup");
            }


            var zavrseneOtkazane = Data.Rezervacije.GetList()
                                    .Where(p => p.Status == Status.Otkazana || p.Status == Status.Zavrsena)
                                    .Select(p => (Rezervacija)p);

            return Ok(zavrseneOtkazane.ToList());
        }


        // GET /api/neodobrena/{id}
        [HttpGet, Route("api/neodobrena/{id}")]
        public IHttpActionResult GetNeodobrena(int id)
        {
            var request = HttpContext.Current.Request;
            var authorization = request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest("Autorizacija je obavezna");
            }

            string token = authorization.Substring("Bearer ".Length).Trim();

            if (!Data.LoggedWithToken.ContainsKey(token))
            {
                return BadRequest("Neispravan token");
            }

            // Provera da li je token važeći
            var user = Data.LoggedWithToken[token];
            if (user == null || user.TipKorisnika != TipKorisnika.Administrator)
            {
                return BadRequest("Neovlašćen pristup");
            }

            var neodobrena = Data.Rezervacije.Find(p => p.Id == id);
            if (neodobrena == null || neodobrena.Status != Status.Kreirana)
            {
                return NotFound();
            }

            return Ok(neodobrena);
        }


        // GET /api/odobrena/{id}
        [HttpGet, Route("api/odobrena/{id}")]
        public IHttpActionResult GetOdobrena(int id)
        {
            var request = HttpContext.Current.Request;
            var authorization = request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest("Autorizacija je obavezna");
            }

            string token = authorization.Substring("Bearer ".Length).Trim();

            if (!Data.LoggedWithToken.ContainsKey(token))
            {
                return BadRequest("Neispravan token");
            }

            // Provera da li je token važeći
            var user = Data.LoggedWithToken[token];
            if (user == null)
            {
                return BadRequest("Neovlašćen pristup");
            }

            // Dodatna provera: možete ovde implementirati dodatne provere pristupa

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
            var request = HttpContext.Current.Request;
            var authorization = request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest("Autorizacija je obavezna");
            }

            string token = authorization.Substring("Bearer ".Length).Trim();

            if (!Data.LoggedWithToken.ContainsKey(token))
            {
                return BadRequest("Neispravan token");
            }

            // Provera da li je token važeći
            var user = Data.LoggedWithToken[token];
            if (user == null || user.TipKorisnika != TipKorisnika.Administrator)
            {
                return BadRequest("Neovlašćen pristup");
            }

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
            var request = HttpContext.Current.Request;
            var authorization = request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest("Autorizacija je obavezna");
            }

            string token = authorization.Substring("Bearer ".Length).Trim();

            if (!Data.LoggedWithToken.ContainsKey(token))
            {
                return BadRequest("Neispravan token");
            }

            // Provera da li je token važeći
            var user = Data.LoggedWithToken[token];
            if (user == null)
            {
                return BadRequest("Neovlašćen pristup");
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Pronalaženje rezervacije u memoriji ili bazi podataka
            var rezervacija = Data.Rezervacije.Find(p => p.Id == id);
            if (rezervacija == null)
                return BadRequest($"Rezervacija sa ID {id} nije pronađena.");

            // Pronalaženje leta koji sadrži rezervaciju
            var let = Data.Letovi.Find(l => l.Id == rezervacija.LetId);
            if (let == null || let.Obrisan == "Da")
                return BadRequest($"Let sa ID {rezervacija.LetId} nije pronađen.");

            bool nijeVasaRezervacija = true;
            if(user.TipKorisnika != TipKorisnika.Administrator)
            {
                if(rezervacija.Korisnik == user.KorisnickoIme)
                {
                    nijeVasaRezervacija = false;

                }

                if (nijeVasaRezervacija)
                {
                    return BadRequest($"Nije vasa rezervacija ne mozete da je otkazete");
                }
            }
            

            // Parsiranje datuma i vremena polaska leta
            DateTime datumPolaska;
            DateTime vremePolaska;
            if (!DateTime.TryParseExact(let.DatumPolaska, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out datumPolaska) ||
                !DateTime.TryParseExact(let.VremePolaska, "HH:mm", null, System.Globalization.DateTimeStyles.None, out vremePolaska))
            {
                return BadRequest("Datum ili vreme polaska leta su u nevažećem formatu.");
            }

            // Kombinovanje datuma i vremena polaska u jedan DateTime objekat
            DateTime datumIVremePolaska = new DateTime(
                datumPolaska.Year, datumPolaska.Month, datumPolaska.Day,
                vremePolaska.Hour, vremePolaska.Minute, 0);

            // Provera da li je trenutni datum i vreme više od 24 sata pre polaska leta
            if (datumIVremePolaska - DateTime.Now <= TimeSpan.FromHours(24))
            {
                return BadRequest("Rezervaciju je moguće otkazati najkasnije 24 sata pre polaska leta.");
            }

            // Ažuriranje statusa rezervacije
            rezervacija.Status = Status.Otkazana;
            Data.Rezervacije.Update(rezervacija);

            // Pronalaženje rezervacije u letovima i ažuriranje statusa
            var rezervacijaLet = let.Rezervacije.FirstOrDefault(r => r.Id == id);
            if (rezervacijaLet == null)
                return BadRequest($"Rezervacija sa ID {id} nije pronađena u letu sa ID {rezervacija.LetId}.");

            rezervacijaLet.Status = Status.Otkazana;

            // Ažuriranje broja mesta na letu
            let.BrojSlobodnihMesta += rezervacija.BrojPutnika;
            let.BrojZauzetihMesta -= rezervacija.BrojPutnika;
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


        // GET api/recenzijeinfo/{korisnickoime}
        [HttpGet, Route("api/recenzijeinfo/{korisnickoime}")]
        public IHttpActionResult GetAllRecenzijeForUser(string korisnickoime, [FromUri] int? status = null)
        {
            var request = HttpContext.Current.Request;
            var authorization = request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest("Autorizacija je obavezna");
            }

            string token = authorization.Substring("Bearer ".Length).Trim();

            if (!Data.LoggedWithToken.ContainsKey(token))
            {
                return BadRequest("Neispravan token");
            }

            // Provera da li je token važeći
            var user = Data.LoggedWithToken[token];
            if (user == null)
            {
                return BadRequest("Neovlašćen pristup");
            }

            // Dodatna provera: da li je korisničko ime u URL-u isto kao i korisnik povezan sa tokenom
            if (user.KorisnickoIme != korisnickoime)
            {
                return Unauthorized();
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

            // Filtriramo rezervacije čiji su letovi obrisani
            rezervacije = rezervacije
                .Where(r =>
                {
                    var let = Data.Letovi.Find(l => l.Id == r.LetId);
                    return let != null && let.Obrisan != "Da";
                })
                .ToList();

            // Ako imamo specifikovan status, filtriramo po statusu
            if (status.HasValue)
            {
                if (Enum.IsDefined(typeof(Status), status.Value))
                {
                    var statusEnum = (Status)status.Value;
                    rezervacije = rezervacije.Where(r => r.Status == statusEnum).ToList();
                }
                else
                {
                    return BadRequest("Status nije validan.");
                }
            }

            return Ok(rezervacije);
        }




    }
}
