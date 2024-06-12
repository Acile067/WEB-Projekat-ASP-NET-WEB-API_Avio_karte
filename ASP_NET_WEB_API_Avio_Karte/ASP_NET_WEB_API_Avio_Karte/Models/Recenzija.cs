using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASP_NET_WEB_API_Avio_Karte.Models
{
    public enum StatusRecenzije
    {
        Kreirana,
        Odobrena,
        Odbijena
    }
    public class Recenzija
    {
        public Recenzija()
        {
        }

        public int Id { get; set; }
        public int LetId { get; set; }
        public string Korisnik { get; set; }
        public string Aviokompanija { get; set; }
        public string Naslov {  get; set; }
        public string Sadrzaj {  get; set; }
        public int Ocena { get; set; }
        public string Slika { get; set; }
        public StatusRecenzije StatusRecenzije { get; set; }

        public Recenzija(int id, int letId, string korisnik, string aviokompanija, string naslov, string sadrzaj, int ocena, string slika)
        {
            Id = id;
            LetId = letId;
            Korisnik = korisnik;
            Aviokompanija = aviokompanija;
            Naslov = naslov;
            Sadrzaj = sadrzaj;
            Ocena = ocena;
            Slika = slika;
            StatusRecenzije = StatusRecenzije.Kreirana;
        }

        public Recenzija(Recenzija r)
        {
            Id = r.Id;
            LetId = r.LetId;
            Korisnik = r.Korisnik;
            Aviokompanija = r.Aviokompanija;
            Naslov = r.Naslov;
            Sadrzaj = r.Sadrzaj;
            Ocena = r.Ocena;
            Slika = r.Slika;
            StatusRecenzije = StatusRecenzije.Kreirana;
        }

    }
}