using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASP_NET_WEB_API_Avio_Karte.Models
{
    public class Putnik : Korisnik
    {
        public List<Recenzija> Recenzije { get; set; }
        public List<Rezervacija> Rezervacije { get; set; }

        public Putnik() 
        { 
            TipKorisnika = TipKorisnika.Putnik;
            Recenzije = new List<Recenzija>();
            Rezervacije = new List<Rezervacija>();
        }

        public Putnik(Korisnik korisnik):base(korisnik)
        {
            TipKorisnika = TipKorisnika.Putnik;
            Recenzije = new List<Recenzija>();
            Rezervacije = new List<Rezervacija>();
        }
    }
}