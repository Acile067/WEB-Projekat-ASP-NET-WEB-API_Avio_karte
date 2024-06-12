using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASP_NET_WEB_API_Avio_Karte.Models
{
    public class Data
    {
        public static ListData<Putnik> Putnici;
        public static ListData<Administrator> Administratori;
        public static ListData<Aviokompanija> Aviokompanije;
        public static ListData<Let> Letovi;
        public static ListData<Rezervacija> Rezervacije;
        public static ListData<Recenzija> Recenzije;
        public static Dictionary<string, Korisnik> LoggedWithToken;
        public static void CreateData()
        {
            Putnici = new ListData<Putnik>("putnici");
            Administratori = new ListData<Administrator>("administratori");
            Aviokompanije = new ListData<Aviokompanija>("aviokompanije");
            Letovi = new ListData<Let>("letovi");
            Rezervacije = new ListData<Rezervacija>("rezervacije");
            Recenzije = new ListData<Recenzija>("recenzije");
            LoggedWithToken = new Dictionary<string, Korisnik>();
        }
    }
}