export type Province = {
  idProvince: string;
  name: string;
};

export type District = {
  idProvince: string;
  idDistrict: string;
  name: string;
};

export type Ward = {
  idCommune: string;
  idDistrict: string;
  name: string;
};
