stampanje izvestaja moze se raditi samo u admin modu
Moguce je dodavanje novih korisnika sa ulogama. Ako Andrijana radi i stampanje izvestaja
neka dodeli sebe kao korisnika sa ulogom admin. Tako je preglednije jer tech uloga
ima previse operacija pa da se ne garbag-uje UI
U opciji upload dodatnih fajlova (meni opcija 'u toku') moze se uploadovati obradjena sema
koja mora imati naziv 'sema.jpg' da bi se prikazala u izvestaju
takodje se uz nju (ili naknadno, svejedno je) uploaduju pdf fajlovi izvestaja
Nazivi pdf fajlova su programski definisani, gde je a3 sema uvek sa nazivom 'sema-a3.pdf'
a glavni deo je broj_izvestaja + datum (moguce je da ih bude vise revizija jednog istog izvestaja pa da se
razlikuju).
Takodje, moguce je uploadovati pdsx i dfax fajlove (u slucaju da je osoba koja radi zapisnik to zaboravila da uradi
iz svog dela programa). Kod uploada snimaka, neophodno je da se odjednom uploaduju svi snimci
jer se na osnovu skupa tih fajlova kreira struktura za analizu, i definisu se elementi za ispitivanje.
U slucaju da je neki snimak propusten, uploaduju se svi odjednom ponovo.
Backend takes care o fajlovima koji se salju na server. Rasporedjuje ih u odgovarajuce foldere (snimci folder koji je potreban za analizu i sema folder potreban za izvestaj. Takodje spaja skup A4 stranica sa jednom a3 stranicom u zavrsni izvestaj uz pomoc biblioteke pdf-lib).Pozeljno je uploadovati oba pdf fajla odjednom, nisam testirao kada se jedan po jedan
uploaduje.
