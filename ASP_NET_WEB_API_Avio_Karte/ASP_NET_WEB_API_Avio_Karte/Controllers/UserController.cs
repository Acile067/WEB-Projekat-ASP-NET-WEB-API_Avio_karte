using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static Antlr.Runtime.Tree.TreeWizard;
using ASP_NET_WEB_API_Avio_Karte.Models;
using System.Text;

namespace ASP_NET_WEB_API_Avio_Karte.Controllers
{
    public class UserController : ApiController
    {
        private bool CheckIfExists(string username, string email)
        {
            return Data.Putnici.Find(u => u.KorisnickoIme == username || u.Email == email) != null ||
                 Data.Administratori.Find(u => u.KorisnickoIme == username || u.Email == email) != null;
        }
        //POST /api/user REGISTRATION
        public IHttpActionResult Post(Korisnik k)
        {
            k.TipKorisnika = TipKorisnika.Putnik;
            DateTime dateTime;
            if (DateTime.TryParse(k.DatumRodjenja, out dateTime))
                k.DatumRodjenja = dateTime.ToString("dd/MM/yyyy");

            //if any of properties are null
            if (k.GetType().GetProperties().Select(i => i.GetValue(k)).Any(v => v == null))
                return BadRequest("Sva polja moraju biti popunjena");
            if (CheckIfExists(k.KorisnickoIme, k.Email))
                return BadRequest("Korisnicko ime vec postoji");
            Data.Putnici.Add(new Putnik(k));
            return Created("User", k.KorisnickoIme);
        }

        [HttpPost, Route("api/login")]
        public IHttpActionResult Login(Korisnik k)
        {
            if (string.IsNullOrWhiteSpace(k.KorisnickoIme) || string.IsNullOrWhiteSpace(k.Lozinka))
                return BadRequest();

            Korisnik ret = Data.Putnici.Find(u => u.KorisnickoIme == k.KorisnickoIme && u.Lozinka == k.Lozinka);
            if (ret == null)
                ret = Data.Administratori.Find(u => u.KorisnickoIme == k.KorisnickoIme && u.Lozinka == k.Lozinka);

            if (ret == null)
                return BadRequest("Lose uneti podaci");

            string token = Convert.ToBase64String(Encoding.ASCII.GetBytes(ret.KorisnickoIme + "token")).Replace("=", "");
            Data.LoggedWithToken[token] = ret;
            return Ok(token);
        }

        //DELETE /api/logout/{id}
        [HttpDelete, Route("api/logout/{id}")]
        public IHttpActionResult Logout(string id)
        {
            if (Data.LoggedWithToken.Remove(id))
                return Ok();
            return BadRequest();
        }

        //GET /api/role/{id}
        [HttpGet, Route("api/role/{id}")]
        public string GetRole(string id)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return null;

            return Enum.GetName(typeof(TipKorisnika), Data.LoggedWithToken[id].TipKorisnika);
        }
    }
}
