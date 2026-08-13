const gallery = [
  {
    image: "/",
    title: "Gallery",
    id: "gallery-1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius voluptates quis id iusto recusandae, omnis mollitia eaque similique facilis quod cumque quo vero architecto aut voluptatum exercitationem itaque consectetur nobis",
  },
  {
    image: "/",
    title: "Gallery",
    id: "gallery-2",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius voluptates quis id iusto recusandae, omnis mollitia eaque similique facilis quod cumque quo vero architecto aut voluptatum exercitationem itaque consectetur nobis",
  },
];
export const galleryData = Array(8)
  .fill("")
  .map((row, index) => {
    return {
      image: "/asset/images/komputer.jpg",
      title: "Gallery"+(index+1),
      id: `gallery-${index}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius voluptates quis id iusto recusandae, omnis mollitia eaque similique facilis quod cumque quo vero architecto aut voluptatum exercitationem itaque consectetur nobis",
    };
  });


export const uploadMediaData=
  {
    answerRadio: "image",
    files:[],
    name: [
      {
        value: "",
        placeholder: "",
        label: "",
      },
    ],
    link: [
      {
        value: "",
        placeholder: "",
        label: "",
      },
    ],
  }

