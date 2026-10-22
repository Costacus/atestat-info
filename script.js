// rau = indexul elementului suspect (0, 1, 2...) sau -1 daca mesajul e ok
var scenarii = [
  {
    titlu: "Email: schimbă-ți parola",
    rau: 0,
    parts: [
      ["De la", "Suport Microsoft <no-reply@micros0ft-security.com>"],
      ["Subiect", "Parola contului tău expiră astăzi"],
      ["Mesaj", "Bună, parola contului tău va expira în câteva ore. Apasă butonul de mai jos pentru a o schimba."],
      ["Buton", "[ Schimbă parola ]"]
    ],
    expl: "Domeniul micros0ft-security.com are cifra 0 în loc de litera o și nu aparține Microsoft."
  },
  {
    titlu: "SMS de la curier",
    rau: 2,
    parts: [
      ["Expeditor", "+40 7xx xxx xxx"],
      ["Mesaj", "Coletul tău nu a putut fi livrat. Plătește taxa de 2 lei pentru a reprograma livrarea:"],
      ["Link", "http://curier-colet.top/plata"]
    ],
    expl: "Curierii reali nu cer plăți prin linkuri de pe domenii ciudate (.top). Taxa mică e doar o momeală."
  },
  {
    titlu: "Email de la bancă",
    rau: 2,
    parts: [
      ["De la", "Alerte Banca <alerte@banca-exemplu.ro>"],
      ["Subiect", "Activitate neobișnuită pe contul tău"],
      ["Mesaj", "Contul va fi blocat definitiv dacă nu răspunzi în 30 de minute cu codul PIN și codul CVV al cardului."]
    ],
    expl: "Nicio bancă nu cere PIN-ul sau CVV-ul prin email. Termenul scurt e o tehnică de presiune."
  },
  {
    titlu: "Notificare de securitate",
    rau: -1,
    parts: [
      ["De la", "Google <no-reply@accounts.google.com>"],
      ["Subiect", "Alertă de securitate: autentificare nouă"],
      ["Mesaj", "S-a făcut o autentificare nouă în contul tău. Dacă ai fost tu, nu trebuie să faci nimic. Dacă nu ai fost tu, intră direct în contul tău din aplicație pentru a verifica activitatea."]
    ],
    expl: "Mesaj legitim: domeniul e corect, nu cere date și nu creează presiune."
  },
  {
    titlu: "Mesaj de la director",
    rau: 2,
    parts: [
      ["De la", "Ion Popescu (Director) <i.popescu@firma-ta.ro>"],
      ["Subiect", "Urgent - discret"],
      ["Mesaj", "Sunt în ședință și nu pot vorbi. Cumpără acum 5 carduri cadou de 100 EUR și trimite-mi codurile aici. Nu spune nimănui, te rambursez diseară."]
    ],
    expl: "Este un atac BEC: cerere urgentă și secretă de carduri cadou. Confirmă cererea apelând pe telefon."
  },
  {
    titlu: "Email de la ANAF",
    rau: 3,
    parts: [
      ["De la", "ANAF <rambursari@anaf.ro>"],
      ["Subiect", "Ai drept la o rambursare de 842 RON"],
      ["Text link", "https://www.anaf.ro/rambursare"],
      ["Destinația reală a linkului (la hover)", "http://anaf-rambursari.xyz/formular"]
    ],
    expl: "Textul linkului arată adresa oficială, dar destinația reală duce altundeva. Verifică linkul trecând cu mouse-ul peste el."
  },
  {
    titlu: "Factură atașată",
    rau: 3,
    parts: [
      ["De la", "Contabilitate <contabilitate@furnizor-exemplu.ro>"],
      ["Subiect", "Factura nr. 2041 - scadentă mâine"],
      ["Mesaj", "Bună ziua, găsiți atașată factura. Vă rugăm să o deschideți urgent."],
      ["Atașament", "factura_2041.pdf.exe (1,2 MB)"]
    ],
    expl: "Fișierul are două extensii. În realitate este un program executabil (.exe), nu PDF."
  },
  {
    titlu: "Confirmare comandă",
    rau: -1,
    parts: [
      ["De la", "Magazin Exemplu <comenzi@magazin-exemplu.ro>"],
      ["Subiect", "Comanda #48213 a fost expediată"],
      ["Mesaj", "Salut, Maria! Comanda ta de ieri a fost predată curierului. O poți urmări din contul tău, intrând direct pe magazin-exemplu.ro."]
    ],
    expl: "Mesaj legitim: Nu cere date confidențiale."
  },
  {
    titlu: "Mesaj WhatsApp",
    rau: 1,
    parts: [
      ["Expeditor", "Număr necunoscut"],
      ["Mesaj", "Salut mamă, mi-am stricat telefonul și am număr nou. Poți să-mi trimiți urgent 1500 lei? Îți explic mai târziu."],
      ["Observație", "Prima dată când acest număr îți scrie."]
    ],
    expl: "Este cel mai probabil o înșelătorie. Verifică mesajul cu persoana reală."
  },
  {
    titlu: "Ai câștigat un premiu!",
    rau: 1,
    parts: [
      ["De la", "Concurs Național <premii@castigator-zilei.info>"],
      ["Mesaj", "FELICITĂRI! Ai câștigat un telefon nou! Plătește doar taxa de livrare de 9 lei cu cardul tău."],
      ["Termen", "Oferta expiră în 10 minute."]
    ],
    expl: "Nu te-ai înscris la niciun concurs. Taxa de livrare este pentru a-ți fura datele cardului."
  },
  {
    titlu: "Mesaj de la IT",
    rau: 0,
    parts: [
      ["Salut", "Stimate utilizator,"],
      ["De la", "Departament IT <it-support@firma-ta.ro>"],
      ["Mesaj", "Din cauza unei actualizări, te rugăm să îți confirmi parola în formularul din intranet."]
    ],
    expl: "Salutul generic (Stimate utilizator) arată un mesaj trimis în masă, iar departamentul IT nu cere parola."
  },
  {
    titlu: "Invitație la ședință",
    rau: -1,
    parts: [
      ["De la", "Elena Dumitrescu <elena.dumitrescu@firma-ta.ro>"],
      ["Subiect", "Ședința de echipă - joi, ora 10:00"],
      ["Mesaj", "Bună, am programat ședința săptămânală în sala Dunărea. Ordinea de zi e cea de săptămâna trecută. Ne vedem acolo."]
    ],
    expl: "Mesaj legitim: expeditor din domeniul firmei, conținut obișnuit, fără linkuri sau cereri ciudate."
  },
  {
    titlu: "Parcare cu cod QR",
    rau: 1,
    parts: [
      ["Loc", "Parcare publică, lângă indicatorul cu informații despre plată"],
      ["Observație", "Peste codul QR original e lipit un sticker cu alt cod QR"],
      ["Link după scanare", "https://plata-parcare-rapida.example/card"]
    ],
    expl: "Niciodată nu scanați stickere cu coduri QR. Scammerii pot lipi aceste hartii peste coduri QR legitime (quishing)."
  },
  {
    titlu: "Pagina de autentificare a băncii",
    rau: 1,
    parts: [
      ["Titlu pagină", "Autentificare Internet Banking"],
      ["Adresa din browser", "https://www.banca-ta.ro.login-secure.com/autentificare"],
      ["Formular", "Utilizator, parolă, buton Intră în cont"]
    ],
    expl: "Domeniul real este login-secure.com. Partea banca-ta.ro este doar un subdomeniu pus ca să te păcălească."
  },
  {
    titlu: "Mesaj de la un prieten",
    rau: 1,
    parts: [
      ["De la", "Andrei (prieten, cont Facebook real)"],
      ["Mesaj", "Hei, ai văzut videoul ăsta cu tine? Nu-mi vine să cred"],
      ["Link", "bit.ly/x7Qa9"]
    ],
    expl: "Contul prietenului poate fi spart. Un mesaj vag cu link scurtat e o tehnică clasică. Întreabă prietenul pe alt canal."
  }
];

// variabile
var sesiune = [];
var nr = 0;
var scor = 0;
var selectat = -2;   // -2 = nimic selectat
var gata = false;    // true dupa ce s-a raspuns
var greseli = [];

// schimbare tab
function arata(id) {
  document.getElementById("info").className = "panel";
  document.getElementById("joc").className = "panel";
  document.getElementById(id).className = "panel activ";
}

// start joc
function porneste() {
  // alegem random 10 scenarii
  var copie = scenarii.slice();
  copie.sort(function() { return Math.random() - 0.5; });
  sesiune = copie.slice(0, 10);

  nr = 0;
  scor = 0;
  greseli = [];

  document.getElementById("start").hidden = true;
  document.getElementById("final").hidden = true;
  document.getElementById("game").hidden = false;

  afiseaza();
}

// afisare
function afiseaza() {
  var s = sesiune[nr];
  selectat = -2;
  gata = false;

  document.getElementById("progres").innerHTML = "Scenariul " + (nr + 1) + " din 10";
  document.getElementById("scor").innerHTML = "Scor: " + scor;
  document.getElementById("titluScenariu").innerHTML = s.titlu;
  document.getElementById("feedback").hidden = true;
  document.getElementById("actiuni").hidden = false;
  document.getElementById("btnRaporteaza").disabled = true;

  deseneaza();
}

// deseneaza elementele mesajului
function deseneaza() {
  var s = sesiune[nr];
  var html = "";

  for (var i = 0; i < s.parts.length; i++) {
    var clasa = "part";

    if (gata == false) {
      if (i == selectat) {
        clasa = "part selected";
      }
    } else {
      if (i == s.rau) {
        clasa = "part correct";
      } else if (i == selectat) {
        clasa = "part wrong";
      }
    }

    html = html + '<div class="' + clasa + '" onclick="alege(' + i + ')">';
    html = html + "<b>" + s.parts[i][0] + ":</b> " + s.parts[i][1];
    html = html + "</div>";
  }

  document.getElementById("mesaj").innerHTML = html;
}

// cand dai click pe un element
function alege(i) {
  if (gata == true) {
    return;
  }
  selectat = i;
  document.getElementById("btnRaporteaza").disabled = false;
  deseneaza();
}

function raporteaza() {
  raspunde(selectat);
}

// alegere = indexul ales sau -1 daca nu e nimic suspect
function raspunde(alegere) {
  if (gata == true) {
    return;
  }
  gata = true;

  var s = sesiune[nr];
  selectat = alegere;

  if (alegere == s.rau) {
    scor = scor + 1;
    document.getElementById("rezultat").innerHTML = "Corect! +1 punct";
  } else {
    document.getElementById("rezultat").innerHTML = "Greșit! 0 puncte";

    var ce_ai_ales = "";
    if (alegere == -1) {
      ce_ai_ales = "Ai zis că nu e nimic suspect.";
    } else {
      ce_ai_ales = "Ai ales: " + s.parts[alegere][0] + ".";
    }

    var raspuns_corect = "";
    if (s.rau == -1) {
      raspuns_corect = "Mesajul era legitim.";
    } else {
      raspuns_corect = "Elementul suspect era: " + s.parts[s.rau][0] + ".";
    }

    greseli.push({
      titlu: s.titlu,
      ales: ce_ai_ales,
      corect: raspuns_corect,
      expl: s.expl
    });
  }

  document.getElementById("explicatie").innerHTML = s.expl;
  document.getElementById("scor").innerHTML = "Scor: " + scor;
  document.getElementById("actiuni").hidden = true;
  document.getElementById("feedback").hidden = false;

  if (nr == 9) {
    document.getElementById("btnUrmator").innerHTML = "Vezi rezultatul";
  } else {
    document.getElementById("btnUrmator").innerHTML = "Următorul";
  }

  deseneaza();
}

function urmator() {
  nr = nr + 1;
  if (nr == 10) {
    termina();
  } else {
    afiseaza();
  }
}

// final
function termina() {
  document.getElementById("game").hidden = true;
  document.getElementById("final").hidden = false;
  document.getElementById("scorFinal").innerHTML = "Scor final: " + scor + " / 10";

  var mesaj = "";
  if (scor == 10) {
    mesaj = "Perfect! Nimic nu îți scapă.";
  } else if (scor >= 7) {
    mesaj = "Foarte bine! Mai verifică greșelile de mai jos.";
  } else if (scor >= 4) {
    mesaj = "Nu e rău, dar ai putea fi păcălit. Recitește secțiunea de informații.";
  } else {
    mesaj = "Mai ai de învățat. Citește secțiunea de informații și încearcă din nou.";
  }
  document.getElementById("mesajFinal").innerHTML = mesaj;

  var html = "";
  if (greseli.length > 0) {
    html = "<h3>Ce ai greșit (" + greseli.length + ")</h3>";
    for (var i = 0; i < greseli.length; i++) {
      var g = greseli[i];
      html = html + '<div class="greseala">';
      html = html + "<b>" + g.titlu + "</b><br>";
      html = html + g.ales + " " + g.corect + "<br>";
      html = html + g.expl;
      html = html + "</div>";
    }
  }
  document.getElementById("greseli").innerHTML = html;
}
