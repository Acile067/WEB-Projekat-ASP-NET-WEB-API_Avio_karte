using ASP_NET_WEB_API_Avio_Karte.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ASP_NET_WEB_API_Avio_Karte
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            Data.CreateData();

            Task t = Task.Run(() =>
            {
                // Infinite loop for continuous processing
                while (true)
                {
                    try
                    {
                        // Učitavanje letova
                        var letovi = Data.Letovi.GetList()
                            .Where(p => p.Obrisan != "Da")
                            .Select(p => (Let)p).ToList();

                        // Učitavanje aviokompanija
                        var aviokompanije = Data.Aviokompanije.GetList()
                            .Where(p => p.Obrisana != "Da")
                            .Select(p => (Aviokompanija)p).ToList();

                        // Učitavanje rezervacija
                        var rezervacije = Data.Rezervacije.GetList()
                            .Where(p => p.Status ==  Status.Odobrena || p.Status == Status.Kreirana)
                            .Select(p => (Rezervacija)p).ToList();

                        var putnici = Data.Putnici.GetList()
                            .Select(p => (Putnik)p).ToList();

                        // Ažuriranje statusa letova
                        foreach (var let in letovi)
                        {
                            DateTime datumDolaska;
                            DateTime vremeDolaska;
                            if (!DateTime.TryParseExact(let.DatumDolaska, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out datumDolaska) ||
                                !DateTime.TryParseExact(let.VremeDolaska, "HH:mm", null, System.Globalization.DateTimeStyles.None, out vremeDolaska))
                            {
                                continue;
                            }

                            DateTime datumIVremeDolaska = new DateTime(
                                datumDolaska.Year, datumDolaska.Month, datumDolaska.Day,
                                vremeDolaska.Hour, vremeDolaska.Minute, 0);

                            if (datumIVremeDolaska < DateTime.Now)
                            {
                                let.StatusLeta = StatusLeta.Zavrsen;

                                // Ažuriranje rezervacija povezanih sa ovim letom
                                foreach (var rezervacija in rezervacije.Where(r => r.LetId == let.Id))
                                {
                                    rezervacija.Status = Status.Zavrsena;
                                }
                            }
                        }

                        // Ažuriranje letova unutar aviokompanija
                        foreach (var avio in aviokompanije)
                        {
                            foreach (var let in avio.Letovi)
                            {
                                var matchingLet = letovi.FirstOrDefault(l => l.Id == let.Id);
                                if (matchingLet != null)
                                {
                                    let.StatusLeta = matchingLet.StatusLeta;
                                }

                                if (let.Rezervacije != null)
                                {
                                    foreach (var rezervacija in let.Rezervacije)
                                    {
                                        var matchingRezervacija = rezervacije.FirstOrDefault(r => r.Id == rezervacija.Id);
                                        if (matchingRezervacija != null)
                                        {
                                            rezervacija.Status = matchingRezervacija.Status;
                                        }
                                    }
                                }
                            }
                        }

                        foreach (var putnik in putnici)
                        {
                            foreach (var rezervacija in putnik.Rezervacije)
                            {
                                var matchingRezervacija = rezervacije.FirstOrDefault(r => r.Id == rezervacija.Id);
                                if (matchingRezervacija != null)
                                {
                                    rezervacija.Status = matchingRezervacija.Status;
                                }
                            }
                        }

                        // Čuvanje izmena u letovima
                        Data.Letovi.UpdateFile();

                        // Čuvanje izmena u aviokompanijama
                        Data.Aviokompanije.UpdateFile();

                        // Čuvanje izmena u rezervacijama
                        Data.Rezervacije.UpdateFile();

                        Data.Putnici.UpdateFile();

                        // Log successful update
                        Console.WriteLine($"Data updated successfully at {DateTime.Now}");
                    }
                    catch (Exception ex)
                    {
                        // Log error message
                        Console.WriteLine($"An error occurred: {ex.Message}");
                    }

                    // Pauza od 60 sekundi
                    Thread.Sleep(60000);
                }
            });
        }
    }
}
