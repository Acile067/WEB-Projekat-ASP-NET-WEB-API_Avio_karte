using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ASP_NET_WEB_API_Avio_Karte.Models
{
    public class Aviokompanija
    {
        //[Required]
        public int Id { get; set; } // Dodano polje za jedinstveni identifikator
        [Required]
        public string Naziv { get; set; }
        [Required]
        public string Adresa { get; set; }
        [Required]
        public string Telefon { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string Obrisana { get; set; }
        public List<Let> Letovi { get; set; }
        public List<Recenzija> Recenzije { get; set; }

        public Aviokompanija()
        {
            Letovi = new List<Let>();
            Recenzije = new List<Recenzija>();
        }

        public Aviokompanija(string naziv, string adresa, string telefon, string email)
        {
            Naziv = naziv;
            Adresa = adresa;
            Telefon = telefon;
            Email = email;
            Obrisana = "Ne";
            Letovi = new List<Let>();
            Recenzije = new List<Recenzija>();
        }

        public Aviokompanija(Aviokompanija a)
        {
            Id = a.Id;
            Naziv = a.Naziv;
            Adresa = a.Adresa;
            Telefon = a.Telefon;
            Email = a.Email;
            Obrisana = "Ne";
            Letovi = new List<Let>();
            Recenzije = new List<Recenzija>();
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            Aviokompanija other = (Aviokompanija)obj;
            return Id == other.Id;
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}