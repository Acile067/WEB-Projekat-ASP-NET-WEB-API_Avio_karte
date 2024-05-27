using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASP_NET_WEB_API_Avio_Karte.Models
{
    public class Aviokompanija
    {
        public string Naziv {  get; set; }
        public string Adresa { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public List<Let> Letovi { get; set; }
        public List<Recenzija> Recenzije { get; set; }
    }
}