// app/app.config.ts
export default defineAppConfig({
  ui: {
    // Buttons
    button: {
      variants: {
        variant: {
          smallPrimaryActionButton:
            'rounded-full bg-brand-500 hover:bg-brand-600 text-surface-500 !px-6 !py-2 transition-colors shadow-sm font-bold tracking-wide cursor-pointer',
          smallAccentActionButton:
            'rounded-full bg-accent-500 hover:bg-accent-600 text-surface-500 !px-6 !py-2 transition-colors shadow-sm font-bold tracking-wide cursor-pointer',
          smallHollowActionButton:
            'rounded-full text-brand-500 ring-1 ring-brand-500/40 hover:bg-brand-500/20 !px-6 !py-2 transition-colors text-xs font-semibold cursor-pointer',

          actionHeroButton:
            'rounded-full inline-flex items-center justify-center !px-12 h-14 bg-brand-500 hover:bg-brand-600 text-surface-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] font-bold tracking-wide transition-all hover:-translate-y-1 !text-xl cursor-pointer',
          actionAccentHeroButton:
            'rounded-full inline-flex items-center justify-center px-10 !h-12 bg-accent-500 hover:bg-accent-600 text-surface-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] font-semibold tracking-wide transition-all hover:-translate-y-1 !text-md cursor-pointer',

          actionOkButton:
            'rounded-full !px-10 justify-center bg-brand-500 hover:bg-brand-600 text-surface-500 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] h-12 font-bold tracking-wide transition-all text-lg cursor-pointer',
          actionCancelButton:
            'rounded-full !px-10 justify-center bg-transparent ring-1 ring-accent-500 text-accent-500 hover:bg-accent-500 hover:text-surface-500 h-11 font-bold tracking-wide transition-colors cursor-pointer',

          glassButton:
            'h-10 px-8 text-md bg-surface-500/70 backdrop-blur-xl text-dark-text ring-1 ring-dark-text/10 hover:bg-surface-500/90 transition-colors cursor-pointer',
          glassOutlineButton:
            'border border-brand-500/50 px-6 py-2.5 rounded-md bg-light-bg/70 hover:bg-light-bg text-dark-text transition-colors backdrop-blur-md cursor-pointer',
          glassIconButton:
            'w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-500/70 backdrop-blur-xl text-dark-text ring-1 ring-dark-text/10 hover:bg-surface-500/90 transition-colors',
          glassIconButtonDanger:
            'w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-500/70 backdrop-blur-xl text-dark-text ring-1 ring-dark-text/10 hover:bg-error-500 hover:text-white transition-colors',
          glassIconButtonBrand:
            'w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0 cursor-pointer bg-surface-500/70 backdrop-blur-xl text-brand-500 ring-1 ring-dark-text/10 hover:bg-brand-50 transition-colors',
          
          ghostDangerIconButton:
            'text-dark-text/70 hover:text-error-500 transition-colors p-0',
          ghostBrandIconButton:
            'text-surface-500 hover:text-brand-500 p-1 transition-colors',
        },
      },
    },

    // Cards
    card: {
      slots: {
        root: 'w-full',
        body: 'p-8',
      },
      variants: {
        variant: {
          glass: {
            root: 'bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-500/50 text-dark-text max-w-md mx-auto w-full',
          },
          interactiveGlass: {
            root: 'bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-500/50 text-dark-text transition-transform hover:-translate-y-1',
            body: 'flex flex-col items-center justify-center h-full text-center p-8',
          },
          outlineGlass: {
            root: 'bg-surface-600/10 backdrop-blur-xl rounded-[25px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-0 ring-2 ring-white/60 text-white transition-all duration-500 ease-in-out',
            body: 'p-8 h-full flex flex-col',
          },
          pointedGlass: {
            root: 'bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-surface-500/50 text-dark-text transition-transform hover:-translate-y-1 cursor-pointer',
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
        root: '!bg-brand-500 text-surface-500 flex items-center justify-center rounded-full shadow-sm ring-1 ring-brand-500/30 font-bold overflow-hidden hover:ring-2 hover:ring-brand-500 transition-all',
      },
      variants: {
        size: {
          header: {
            root: 'w-9 h-9 text-base',
          },
          profileLg: {
            root: 'w-24 h-24 text-4xl shadow-md mb-2',
          },
        },
      },
      defaultVariants: {
        size: 'header',
      },
    },

    // Select
    select: {
      slots: {
        base: 'rounded-full text-brand-500 ring-1 ring-brand-500 bg-surface-500/70 backdrop-blur-md !px-4 !py-2 transition-colors text-xs font-semibold shadow-sm cursor-pointer justify-between min-w-36 flex-row-reverse',
        trailingIcon: 'absolute right-25 transition-transform pointer-events-none text-brand-500',
        content:
          'z-[100] bg-text backdrop-blur-xl rounded-2xl ring-1 ring-brand-500/30 shadow-xl text-dark-text mt-2 min-w-40',
        viewport: 'p-1',
        item: 'flex items-center justify-center text-center py-2 px-4 hover:bg-brand-500/20 text-dark-text cursor-pointer data-[highlighted]:bg-brand-500/20 data-[highlighted]:text-dark-text font-medium text-xs rounded-xl mx-1 my-0.5',
      },
    },

    // Modal
    modal: {
      slots: {
        overlay: 'fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm',
        content:
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] !w-full max-w-md bg-white/90 backdrop-blur-2xl !rounded-[25px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/10 focus:outline-none overflow-hidden',
      },
    },
  },

  // Layout
  layout: {
    base: 'min-h-screen flex flex-col bg-light-bg text-dark-text font-sans bg-cover bg-center bg-no-repeat bg-fixed',
    mainDefault: 'flex-1 flex flex-col',
    mainAuth: 'flex-1 flex items-center justify-center p-6',
  },

  // Footer
  footer: {
    base: 'py-5 px-6 flex items-center justify-between text-xs text-dark-text bg-light-bg/70 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-10',
    text: 'font-medium opacity-80',
  },

  typography: {
    pageTitle: 'text-3xl font-bold text-surface-500 tracking-wide text-center',
    pageSubtitle: 'text-sm opacity-80 capitalize text-surface-500 font-semibold mt-1',
    cardTitle: 'text-xl font-bold tracking-wide text-dark-text truncate pr-2',
    cardTitleCenter: 'text-xl font-bold text-center tracking-wide text-dark-text truncate pr-2',
  }
});
