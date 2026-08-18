// app/app.config.ts
export default defineAppConfig({
  ui: {
    // Buttons
    button: {
      variants: {
        variant: {
          smallPrimaryActionButton:
            'rounded-full bg-brand-500 hover:bg-brand-600 text-surface-500 !px-6 !py-2 transition-colors shadow-sm font-bold tracking-wide',
          smallAccentActionButton:
            'rounded-full bg-accent-500 hover:bg-accent-600 text-surface-500 !px-6 !py-2 transition-colors shadow-sm font-bold tracking-wide',
          smallHollowActionButton:
            'rounded-full text-brand-500 ring-1 ring-brand-500/40 hover:bg-brand-500/20 !px-6 !py-2 transition-colors text-xs font-semibold',

          actionHeroButton:
            'rounded-full inline-flex items-center justify-center !px-12 h-14 bg-brand-500 hover:bg-brand-600 text-surface-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] font-bold tracking-wide transition-all hover:-translate-y-1 !text-xl',

          actionOkButton:
            'rounded-full !px-10 justify-center bg-brand-500 hover:bg-brand-600 text-surface-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] h-12 font-bold tracking-wide transition-all text-lg',
          actionCancelButton:
            'rounded-full !px-10 justify-center bg-transparent ring-1 ring-accent-500 text-accent-500 hover:bg-accent-500 hover:text-surface-500 h-11 font-bold tracking-wide transition-colors',

          glassButton:
            'h-10 px-8 text-md bg-surface-500/70 backdrop-blur-xl text-dark-text ring-1 ring-dark-text/10 hover:bg-surface-500/90 transition-colors',
          glassOutlineButton:
            'border border-brand-500/50 px-6 py-2.5 rounded-md bg-light-bg/70 hover:bg-light-bg text-dark-text transition-colors backdrop-blur-md',
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
            root: 'bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-500/50 text-dark-text',
          },
          interactiveGlass: {
            root: 'bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-500/50 text-dark-text transition-transform hover:-translate-y-1',
            body: 'flex flex-col items-center justify-center h-full text-center p-8',
          }
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
            base: 'bg-input-bg text-dark-text rounded-xl ring-1 ring-input-border placeholder:text-text-muted focus:ring-2 focus:ring-brand-500 transition-colors h-11 px-4 shadow-none',
          },
          glassError: {
            base: 'bg-error-50 text-error-900 rounded-xl ring-1 ring-error-500 placeholder:text-error-300 focus:ring-2 focus:ring-error-500 transition-colors h-11 px-4 shadow-none',
          },
        },
      },
    },

    // Form fields
    formField: {
      slots: {
        label: 'text-sm font-medium text-dark-text mb-1.5 ml-1 block',
        error: 'text-error-400 text-sm text-left font-small',
      },
    },

    // Avatar
    avatar: {
      slots: {
        root: '!w-9 !h-9 !bg-brand-500 text-surface-500 flex items-center justify-center rounded-full shadow-sm ring-1 ring-brand-500/30 font-bold overflow-hidden hover:ring-2 hover:ring-brand-500',
      },
    },
  },
});