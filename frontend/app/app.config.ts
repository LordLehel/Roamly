// app/app.config.ts
export default defineAppConfig({
  ui: {
    // Buttons
    button: {
      variants: {
        variant: {
          glass:
            'h-10 px-6 text-md ring-1 ring-green-800 bg-green-950/50 hover:bg-green-800 hover:ring-1 hover:ring-green-500 text-green-50 transition-colors backdrop-blur-md',
          glassOutline:
            'border border-green-500/50 px-4 py-2 rounded-md bg-green-950/50 hover:bg-green-800 text-green-50 transition-colors backdrop-blur-md',
        },
      },
    },

    // Cards
    card: {
      slots: {
        root: 'w-full max-w-md',
        body: 'p-8',
      },
      variants: {
        variant: {
          glass: {
            root: 'bg-black/60 backdrop-blur-xl ring-1 ring-green-500/30 shadow-2xl shadow-black/80',
          },
        },
      },
    },

    // Input fields
    input: {
      slots: {
        root: 'w-full',
      },
      variants: {
        variant: {
          glass: {
            base: 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 placeholder:text-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
          },
          glassError: {
            base: 'bg-red-950/50 text-red-50 ring-1 ring-red-500 placeholder:text-red-400 focus:ring-1 focus:ring-red-500 transition-colors',
          },
        },
      },
    },

    // Form fields
    formField: {
      slots: {
        label: 'text-sm text-green-400 mb-1 block',
      },
    },

    // Avatar
    avatar: {
      slots: {
        root: 'ring-1 ring-green-500/50 bg-green-950/50 backdrop-blur-md hover:bg-green-800 text-green-50 transition-colors',
      },
    },
  },
});
