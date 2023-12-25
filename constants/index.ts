export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Create events",
    route: "/events/create",
  },
  {
    label: "My profile",
    route: "/profile",
  },
];

export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: "",
  isFree: false,
  url: "",
};
