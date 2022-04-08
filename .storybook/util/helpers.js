// Returns a function to generate stories
export const storyFactory = options => {
  const { title, component, args, argTypes, description } = options;
  return {
    title,
    component,
    // component-level default args to the component being tested
    // you could add other app-level options here, too!
    args: {
      dark: true,
      ...args,
    },
    argTypes: {
      locale: {
        defaultValue: "en",
        control: {
          type: "inline-radio",
          options: { English: "en", Español: "es" },
        },
      },
    },
    parameters: {
      docs: {
        description: {
          component: description,
        },
      },
    },
  };
};
