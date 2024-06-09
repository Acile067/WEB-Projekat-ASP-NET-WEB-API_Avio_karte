using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASP_NET_WEB_API_Avio_Karte.Models
{
    public enum Status
    {
        Kreirana,
        Odobrena,
        Otkazana,
        Zavrsena
    }
    public class Rezervacija
    {
        public Rezervacija()
        {
        }
        public int Id { get; set; }
        public int LetId { get; set; }
        public string Korisnik { get; set; }
        public int BrojPutnika {  get; set; }
        public double UkupnaCena { get; set; }
        public Status Status { get; set; }

        public Rezervacija(int id, int letId, string korisnik, int brojPutnika, double ukupnaCena, Status status)
        {
            Id = id;
            LetId = letId;
            Korisnik = korisnik;
            BrojPutnika = brojPutnika;
            UkupnaCena = ukupnaCena;
            Status = status;
        }
        public Rezervacija(Rezervacija r)
        {
            Id = r.Id;
            LetId = r.LetId;
            Korisnik = r.Korisnik;
            BrojPutnika = r.BrojPutnika;
            UkupnaCena = r.UkupnaCena;
            Status = Status.Kreirana;
        }
    }
}