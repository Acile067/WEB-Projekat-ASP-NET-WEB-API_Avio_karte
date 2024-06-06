using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        public int AviokompanijaId {  get; set; }
        public int Id { get; set; }
        public string Aviokompanija {  get; set; }
        
        public string PolaznaDestinacija {  get; set; }
        
        public string OdredistnaDestinacija { get; set; }
        [Required]
        public string DatumPolaska { get; set; }
        [Required]
        public string VremePolaska { get; set; }
        [Required]
        public string DatumDolaska { get; set; }
        [Required]
        public string VremeDolaska { get; set; }
        [Required]
        public int BrojSlobodnihMesta { get; set; }
        public int BrojZauzetihMesta { get; set; }
        [Required]
        public double Cena {  get; set; }
        public StatusLeta StatusLeta { get; set; }
        public List<Rezervacija> Rezervacije { get; set; }
        public string Obrisan { get; set; }

        public Let(int id, int aviokompanijaId, string aviokompanija, string polaznaDestinacija, string odredistnaDestinacija, DateTime datumPolaska, string vremePolaska, DateTime datumDolaska, string vremeDolaska, int brojSlobodnihMesta, int brojZauzetihMesta, double cena, StatusLeta statusLeta,List<Rezervacija> rezervacija,string obrisan)
        {
            AviokompanijaId = aviokompanijaId;
            Id = id;
            Aviokompanija = aviokompanija;
            PolaznaDestinacija = polaznaDestinacija;
            OdredistnaDestinacija = odredistnaDestinacija;
            DatumPolaska = datumPolaska.ToString("dd/MM/yyyy");
            VremePolaska = vremePolaska;
            DatumDolaska = datumDolaska.ToString("dd/MM/yyyy");
            VremeDolaska = vremeDolaska;
            BrojSlobodnihMesta = brojSlobodnihMesta;
            BrojZauzetihMesta = brojZauzetihMesta;
            Cena = cena;
            StatusLeta = statusLeta;
            Rezervacije = rezervacija;
            Obrisan = obrisan;
        }

        public Let(Let l)
        {
            AviokompanijaId = l.AviokompanijaId;
            Id = l.Id;
            Aviokompanija = l.Aviokompanija;
            PolaznaDestinacija = l.PolaznaDestinacija;
            OdredistnaDestinacija = l.OdredistnaDestinacija;
            DatumPolaska = l.DatumPolaska;
            VremePolaska = l.VremePolaska;
            DatumDolaska = l.DatumDolaska;
            VremeDolaska = l.VremeDolaska;
            BrojSlobodnihMesta = l.BrojSlobodnihMesta;
            BrojZauzetihMesta = 0;
            Cena = l.Cena;
            StatusLeta = StatusLeta.Aktivan;
            Rezervacije = new List<Rezervacija>();
            Obrisan = "Ne";
        }

        public Let()
        {
        }
    }
}