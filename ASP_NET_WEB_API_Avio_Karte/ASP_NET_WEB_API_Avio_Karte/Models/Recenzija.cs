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
        public string Korisnik { get; set; }
        public string Aviokompanija { get; set; }
        public string Naslov {  get; set; }
        public string Sadrzaj {  get; set; }
        public int Ocena { get; set; }
        public StatusRecenzije StatusRecenzije { get; set; }

    }
}