using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace ASP_NET_WEB_API_Avio_Karte.Models
{
    public enum Pol
    {
        Musko,
        Zensko
    }
    public enum TipKorisnika
    {
        Putnik, 
        Administrator
    }
    public class Korisnik
    {
        public Korisnik()
        {
        }

        public string KorisnickoIme { get; set; }
        public string Lozinka { get; set; }
        public string Ime {  get; set; }
        public string Prezime {  get; set; }
        public string Email { get; set; }
        public string DatumRodjenja { get; set; }
        public Pol Pol {  get; set; }
        public TipKorisnika TipKorisnika { get; set; }

        public Korisnik(string korisnickoIme, string lozinka, string ime, string prezime, string email, DateTime datumRodjenja, Pol pol, TipKorisnika tipKorisnika)
        {
            KorisnickoIme = korisnickoIme;
            Lozinka = lozinka;
            Ime = ime;
            Prezime = prezime;
            Email = email;
            DatumRodjenja = datumRodjenja.ToString("dd/MM/yyyy");
            Pol = pol;
            TipKorisnika = tipKorisnika;
        }

        public Korisnik(Korisnik korisnik)
        {
            KorisnickoIme = korisnik.KorisnickoIme;
            Lozinka = korisnik.Lozinka;
            Ime = korisnik.Ime;
            Prezime = korisnik.Prezime;
            Email = korisnik.Email;
            DatumRodjenja = korisnik.DatumRodjenja;
            Pol = korisnik.Pol;
            TipKorisnika = korisnik.TipKorisnika;
        }
    }
}