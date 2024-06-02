using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASP_NET_WEB_API_Avio_Karte.Models
{
    public enum StatusLeta
    {
        Aktivan,
        Otkazan,
        Zavrsen
    }
    public class Let
    {
        public string Aviokompanija {  get; set; }
        public string PolaznaDestinacija {  get; set; }
        public string OdredistnaDestinacija { get; set; }
        public string DatumIVremePolaska { get; set; }
        public string DatumIVremeDolaska { get; set; }
        public int BrojSlobodnihMesta { get; set; }
        public int BrojZauzetihMesta { get; set; }
        public double Cena {  get; set; }
        public StatusLeta StatusLeta { get; set; }
        public string Obrisan { get; set; }

    }
}