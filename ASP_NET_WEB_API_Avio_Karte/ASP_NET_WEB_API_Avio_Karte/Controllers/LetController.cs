using ASP_NET_WEB_API_Avio_Karte.Models;
using System.Globalization;
using System;
using System.Linq;
using System.Web.Http;
using System.Web;

namespace ASP_NET_WEB_API_Avio_Karte.Controllers
{
    public class LetController : ApiController
    {
        // POST /api/let REGISTRATION
        [HttpPost, Route("api/let")]
        public IHttpActionResult Post(Let l)
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

            var user = Data.LoggedWithToken[token];
            if (user.TipKorisnika != TipKorisnika.Administrator)
            {
                return BadRequest("Morate biti administrator");
            }

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

            if (aviokompanija == null || aviokompanija.Obrisana == "Da")
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

            var user = Data.LoggedWithToken[token];
            if (user.TipKorisnika != TipKorisnika.Administrator)
            {
                return BadRequest("Morate biti administrator");
            }

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var let = Data.Letovi.Find(p => p.Id == id);
            if (let == null || let.Obrisan == "Da")
                return NotFound();

            if (let.Cena != l.Cena)
            {
                foreach (var rezervacija in let.Rezervacije)
                {
                    if (rezervacija.Status == Status.Kreirana || rezervacija.Status == Status.Odobrena)
                    {
                        return BadRequest("Ne mozete promeniti cenu zato sto ima odobrenih/kreiranih rezervacija.");
                    }
                }
            }

            if (let.AviokompanijaId != l.AviokompanijaId)
            {
                var oldAviokompanija = Data.Aviokompanije.GetList().FirstOrDefault(a => a.Id == let.AviokompanijaId);
                var newAviokompanija = Data.Aviokompanije.GetList().FirstOrDefault(a => a.Id == l.AviokompanijaId);

                if (newAviokompanija == null)
                    return BadRequest("Nova Aviokompanija ne postoji");

                if (oldAviokompanija != null)
                {
                    var letToRemove = oldAviokompanija.Letovi.FirstOrDefault(f => f.Id == let.Id);
                    if (letToRemove != null)
                    {
                        oldAviokompanija.Letovi.Remove(letToRemove);
                        Data.Aviokompanije.Update(oldAviokompanija);
                    }
                }

                let.AviokompanijaId = l.AviokompanijaId;
                let.Aviokompanija = newAviokompanija.Naziv;

                newAviokompanija.Letovi.Add(let);
                Data.Aviokompanije.Update(newAviokompanija);
            }

            var aviokompanija = Data.Aviokompanije.GetList().FirstOrDefault(a => a.Id == l.AviokompanijaId);

            if ( aviokompanija == null || aviokompanija.Obrisana == "Da")
            {
                return BadRequest("Ne postoji aviokompanija");
            }

            var letuaviokompaniji = aviokompanija.Letovi.Find(a => a.Id == l.Id);
            if(letuaviokompaniji == null || letuaviokompaniji.Obrisan == "Da")
            {
                return NotFound();
            }

            DateTime dateTimePolaska;
            if (DateTime.TryParse(l.DatumPolaska, out dateTimePolaska))
            {
                let.DatumPolaska = dateTimePolaska.ToString("dd/MM/yyyy");
                letuaviokompaniji.DatumPolaska = dateTimePolaska.ToString("dd/MM/yyyy");
            }
                

            DateTime dateTimeDolaska;
            if (DateTime.TryParse(l.DatumDolaska, out dateTimeDolaska))
            {
                let.DatumDolaska = dateTimeDolaska.ToString("dd/MM/yyyy");
                letuaviokompaniji.DatumDolaska = dateTimeDolaska.ToString("dd/MM/yyyy");
            }
                

            let.VremePolaska = l.VremePolaska;
            let.VremeDolaska = l.VremeDolaska;
            let.BrojSlobodnihMesta = l.BrojSlobodnihMesta;
            let.BrojZauzetihMesta = l.BrojZauzetihMesta;
            let.Cena = l.Cena;
            let.StatusLeta = l.StatusLeta;

            letuaviokompaniji.VremePolaska = l.VremePolaska;
            letuaviokompaniji.VremeDolaska = l.VremeDolaska;
            letuaviokompaniji.BrojSlobodnihMesta = l.BrojSlobodnihMesta;
            letuaviokompaniji.BrojZauzetihMesta = l.BrojZauzetihMesta;
            letuaviokompaniji.Cena = l.Cena;
            letuaviokompaniji.StatusLeta = l.StatusLeta;

            if(l.StatusLeta == StatusLeta.Zavrsen)
            {
                

                foreach (var rezervacija in let.Rezervacije)
                {
                    rezervacija.Status = Status.Zavrsena;
                    var putnik = Data.Putnici.Find(p => p.KorisnickoIme == rezervacija.Korisnik);
                    foreach (var rez in putnik.Rezervacije)
                    {
                        if (rez.Id == rezervacija.Id)
                        {
                            var rezervacijaufajlu = Data.Rezervacije.Find(p => p.LetId == l.Id || p.Id == rezervacija.Id);
                            rezervacijaufajlu.Status = Status.Zavrsena;
                            rez.Status = Status.Zavrsena;
                            Data.Rezervacije.Update(rezervacijaufajlu);
                        }
                    }
                    Data.Putnici.Update(putnik);
                }
                foreach(var rezervacija in letuaviokompaniji.Rezervacije)
                {
                    rezervacija .Status = Status.Zavrsena;
                }
            }
            else if(l.StatusLeta == StatusLeta.Otkazan)
            {
                foreach (var rezervacija in let.Rezervacije)
                {
                    rezervacija.Status = Status.Otkazana;
                    var putnik = Data.Putnici.Find(p => p.KorisnickoIme == rezervacija.Korisnik);
                    foreach(var rez in putnik.Rezervacije)
                    {
                        if(rez.Id == rezervacija.Id)
                        {
                            var rezervacijaufajlu = Data.Rezervacije.Find(p => p.LetId == l.Id || p.Id == rezervacija.Id);
                            rezervacijaufajlu.Status = Status.Otkazana;
                            rez.Status = Status.Otkazana;
                            Data.Rezervacije.Update(rezervacijaufajlu);
                        }
                    }
                    Data.Putnici.Update(putnik);
                }
                foreach (var rezervacija in letuaviokompaniji.Rezervacije)
                {
                    rezervacija.Status = Status.Otkazana;
                }
            }



            Data.Letovi.Update(let);
            Data.Aviokompanije.Update(aviokompanija);

            return Ok(let);
        }


        // DELETE /api/let/{id}
        [HttpDelete, Route("api/let/{id}")]
        public IHttpActionResult DeleteLet(int id)
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

            var user = Data.LoggedWithToken[token];
            if (user.TipKorisnika != TipKorisnika.Administrator)
            {
                return BadRequest("Morate biti administrator");
            }

            var let = Data.Letovi.Find(p => p.Id == id);
            if (let == null || let.Obrisan  == "Da")
                return NotFound();

            foreach (var rezervacija in let.Rezervacije)
            {
                if (rezervacija.Status == Status.Kreirana || rezervacija.Status == Status.Odobrena)
                {
                    return BadRequest("Let ne može biti obrisan jer ima aktivne rezervacije.");
                }
            }

            let.Obrisan = "Da";
            Data.Letovi.UpdateFile();

            var aviokompanija = Data.Aviokompanije.GetList().FirstOrDefault(a => a.Id == let.AviokompanijaId);
            if (aviokompanija != null)
            {
                var letInAviokompanija = aviokompanija.Letovi.FirstOrDefault(l => l.Id == let.Id);
                if (letInAviokompanija != null)
                {
                    letInAviokompanija.Obrisan = "Da";
                    Data.Aviokompanije.Update(aviokompanija);
                }
            }

            return Ok();
        }


        // GET /api/letovizakorisnika/{korisnik}
        [HttpGet, Route("api/letovizakorisnika/{korisnik}")]
        public IHttpActionResult GetAllLetoviZaUsers(string korisnik, string statusleta = null)
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
            if (user.KorisnickoIme != korisnik)
            {
                return Unauthorized();
            }

            var letovi = Data.Letovi.GetList()
                                    .Where(p => p.Obrisan != "Da" && p.Rezervacije.Any(r => r.Korisnik == korisnik));

            if (!string.IsNullOrEmpty(statusleta))
            {
                // Pokušaj da parsiraš status leta
                if (Enum.TryParse(statusleta, out StatusLeta parsedStatusLeta))
                {
                    // Filtriraj letove prema statusu
                    letovi = letovi.Where(p => p.StatusLeta == parsedStatusLeta);
                }
                else
                {
                    // Ako status nije validan, možeš vratiti bad request
                    return BadRequest("Nevalidan status leta.");
                }
            }

            return Ok(letovi.ToList());
        }



    }
}
