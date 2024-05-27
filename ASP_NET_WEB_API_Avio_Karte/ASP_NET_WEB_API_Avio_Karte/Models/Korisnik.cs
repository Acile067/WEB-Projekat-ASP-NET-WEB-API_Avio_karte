using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
        public string KorisnickoIme { get; set; }
        public string Lozinka { get; set; }
        public string Ime {  get; set; }
        public string Prezime {  get; set; }
        public string Email { get; set; }
        public string DatumRodjenja { get; set; }
        public Pol Pol {  get; set; }
        public TipKorisnika TipKorisnika { get; set; }
        public List<Recenzija> Recenzije { get; set; }
    }
}