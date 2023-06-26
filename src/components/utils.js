export function calculatePageCount(
  narudzbenica,
  ispList,
  polja,
  history,
  setNo,
  setIspCurr,
  setIspPolja,
  reports,
  setIzvBr,
  setPageCount,
  setNapIzv
) {
  if (narudzbenica?.stavke && polja && history) {
    let no_el = Object.keys(history).length;
    let strNo = 1;
    let acc = 0;
    setNo(no_el);
    let tIsp = ispList.filter((i) => {
      return i.narudzbenica === narudzbenica.broj_narudzbenice;
    });
    setIspCurr(tIsp);
    if (polja.length) {
      let f = polja;
      for (let i = 0; i < f.length; i++) {
        f[i].element = f[i].element?.filter((e) => {
          return Object.keys(history).includes(e.moja_sifra);
        });
      }
      for (let i = 0; i < f.length; i++) {
        if (f[i].element && f[i].element.length) {
          acc += f[i].element.length;
        }
        if (acc > 44) {
          strNo++;
          acc = 0;
          i = i - 1;
        }
        if (i > 1 && f[i].napon !== f[i - 1].napon) {
          acc += 4;
        }
      }
      setIspPolja(f);
      let tIzvest = reports.filter((r) => {
        return r.narudzbenica === narudzbenica.broj_narudzbenice;
      });
      if (tIzvest.length) setIzvBr({ ...tIzvest[0] });
    }
    let nap = {};
    for (let i = 0; i < narudzbenica.stavke.length; i++) {
      if ([1, 2, 6, 7, 10, 12].includes(narudzbenica.stavke[i].pos))
        nap[10] = nap[10]
          ? [...nap[10], narudzbenica.stavke[i]]
          : [narudzbenica.stavke[i]];
      else if ([3, 4, 8, 9, 11, 13].includes(narudzbenica.stavke[i].pos))
        nap[35] = nap[35]
          ? [...nap[35], narudzbenica.stavke[i]]
          : [narudzbenica.stavke[i]];
      else if ([5, 14].includes(narudzbenica.stavke[i].pos))
        nap[110] = nap[110]
          ? [...nap[110], narudzbenica.stavke[i]]
          : [narudzbenica.stavke[i]];
    }
    no_el += 8 + strNo + Object.keys(nap).length;
    setPageCount(no_el);
    setNapIzv(nap);
  }
}
