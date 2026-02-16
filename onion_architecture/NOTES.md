# NOTES

## SETUP

This was the most challenging part; setting up the workspaces and ensuring seamless cross-package communication took significantly more time than originally planned.

## ARCHITECTURE

The way the architecture is structured is quite compelling. Once the specific responsibilities of each layer become clear, the rationale behind this design becomes much more apparent.

## ISSUES

I encountered difficulties establishing a shared TypeScript configuration across all packages. Additionally, I faced a dependency injection issue due to reference conflicts, which I managed to resolve by implementing String Tokens in the HTTP layer.

I haven't yet achieved 100% reliable hot reloading across the monorepo.

## DISCLAIMER

My focus was not on granular code-level details, but rather on how to implement Onion Architecture in a way that ensures application scalability.

Since I only implemented a few methods, I leveraged Generative AI to anticipate potential bottlenecks and future growth; the documentation reflects these projections. However, without a full-scale stress test, I cannot yet definitively confirm the architecture's ultimate growth capacity.
