// Returns a function to generate stories
export const storyFactory = options => {
  const { title, component, args, argTypes, description } = options;
  return {
    title,
    component,
    args: {
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

      onClick: {
        action: "clicked",
        table: {
          type: {
            summary: null,
          },
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
