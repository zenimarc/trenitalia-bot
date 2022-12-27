const params2 =
  "?transportMeanName=2516&origin=830001645&departure_time=2021-09-25T18%3A00%3A00.000-04%3A00";
// forse departure time non indispensabile, origin lo ottengo da prima richiesta

export const ViaggiaTrenoAPIUrl =
  "http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno";
export const ViaggiaTrenoElencoStazioniPath = "/elencoStazioni/0";
export const ViaggiaTrenoElencoTrattePath =
  "/elencoTratte/0/6/ES*,IC,EXP,EC,EN/null/";
export const ViaggiaTrenoMeteoPath = "/datimeteo/0";
export const ViaggiaTrenoDettaglioTrattaPath = "/dettagliTratta/0/";
export const ViaggiaTrenoRSSNowPath = "/infomobilitaRSS/false";
