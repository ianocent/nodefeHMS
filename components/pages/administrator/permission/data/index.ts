export const dataForm = {
  user: [
    {
      label: "Name",
      type: "text",
      typeInput: "base",
      value: "",
      error: false,
      required: true,
      style: "col-span-6",
      placeholder: "",
    },
    {
      label: "Email",
      type: "email",
      typeInput: "base",
      value: "",
      error: false,
      required: true,
      style: "col-span-6",
      placeholder: "",
    },
  ],
  authentification: {
    password: {
      label: "password",
      type: "password",
      typeInput: "password",
      value: "",
      error: false,
      required: true,
      style: "col-span-6",
      placeholder: "",
    },
    confirmPassword: {
      label: "Confirm Password",
      type: "password",
      typeInput: "password",
      value: "",
      error: false,
      required: true,
      style: "col-span-6",
      placeholder: "",
    },
  },

  authorization: {
    role: {
      label: "Email",
      type: "email",
      typeInput: "select",
      value: "",
      error: false,
      required: true,
      style: "col-span-6",
      placeholder: "",
      options: [
        {
          value: "1",
          label: "admin",
        },
        {
          value: "2",
          label: "users",
        },
      ],
    },

    permission: {
      value: [""],
      isAllChecked: false,
      options: [
        {
          label: "test-1",

          value: "test-1",
        },
        {
          label: "test-2",

          value: "test-2",
        },
        {
          label: "test-3",

          value: "test-3",
        },
        {
          label: "test-4",

          value: "test-4",
        },
        {
          label: "test-5",

          value: "test-5",
        },
        {
          label: "test-6",

          value: "test-6",
        },
      ],
    },
  },

  status: {
    value: "",
    options: [
      {
        label: "active",

        id: "status-active",
        value: "active",
      },
      {
        label: "in active",

        id: "in-status-active",
        value: "in-active",
      },
    ],
  },
};
