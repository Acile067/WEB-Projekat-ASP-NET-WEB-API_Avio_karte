using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASP_NET_WEB_API_Avio_Karte.Models
{
    public class Administrator : Korisnik
    {

        public Administrator() 
        { 
            TipKorisnika = TipKorisnika.Administrator;
        }
    }
}