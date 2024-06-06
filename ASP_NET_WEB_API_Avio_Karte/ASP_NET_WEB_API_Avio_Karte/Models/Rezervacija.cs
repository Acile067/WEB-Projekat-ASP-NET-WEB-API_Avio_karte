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
        public string Id { get; set; }
        public int Let { get; set; }
        public string Korisnik { get; set; }
        public int BrojPutnika {  get; set; }
        public double UkupnaCena { get; set; }
        public Status Status { get; set; }
    }
}