// app/app.config.ts
export default defineAppConfig({
  ui: {
    // Buttons
    button: {
      variants: {
        variant: {
          green_whole:
            "rounded-full bg-[#7A9A82] hover:bg-[#68856F] text-white px-5 py-2 transition-colors shadow-sm font-bold tracking-wide",
          yellow_whole:
            "rounded-full bg-[#E5A93B] hover:bg-[#D49933] text-white px-5 py-2 transition-colors shadow-sm font-bold tracking-wide",
          custom_outline:
            "rounded-full text-[#7A9A82] ring-1 ring-[#7A9A82]/40 hover:bg-[#7A9A82]/20 px-4 py-1.5 transition-colors text-xs font-semibold",
            
          action_ok:
            "rounded-full w-40 justify-center bg-[#7A9A82] hover:bg-[#68856F] text-white shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] h-12 font-bold tracking-wide transition-all text-lg",
          action_cancel:
            "rounded-full w-40 justify-center bg-transparent ring-1 ring-[#E5A93B] text-[#E5A93B] hover:bg-[#E5A93B] hover:text-white h-11 font-bold tracking-wide transition-colors",
            
          glass:
            'h-10 px-6 text-md bg-white/70 backdrop-blur-xl text-[#2F3E32] ring-1 ring-[#2F3E32]/10 hover:bg-white/90 transition-colors',
          glassOutline:
            'border border-[#7A9A82]/50 px-4 py-2 rounded-md bg-[#EDF1EE]/70 hover:bg-[#EDF1EE] text-[#2F3E32] transition-colors backdrop-blur-md',
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
            root: 'bg-white/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-white/50 text-[#2F3E32]',
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
            base: 'bg-[#E8F0F5] text-[#2F3E32] rounded-xl ring-1 ring-[#D0E0EB] placeholder:text-gray-400 focus:ring-2 focus:ring-[#7A9A82] transition-colors h-11 px-4 shadow-none',
          },
          glassError: {
            base: 'bg-red-50 text-red-900 rounded-xl ring-1 ring-red-500 placeholder:text-red-300 focus:ring-2 focus:ring-red-500 transition-colors h-11 px-4 shadow-none',
          },
        },
      },
    },

    // Form fields
    formField: {
      slots: {
        label: 'text-sm font-medium text-[#2F3E32] mb-1.5 ml-1 block',
      },
    },

    // Avatar
    avatar: {
      slots: {
        root: 'ring-2 ring-[#2F3E32]/10 bg-[#2F3E32] text-[#FAF9F6] backdrop-blur-md shadow-sm',
      },
    },
  },
});