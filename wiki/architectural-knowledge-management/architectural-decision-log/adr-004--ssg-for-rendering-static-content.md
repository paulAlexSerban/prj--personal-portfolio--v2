# ADR-004: Choosing Static Site Generation (SSG) for Rendering Static Content

## Status
Accepted

## Context
The personal portfolio project consists of two primary content sections:
- **Blog**: A collection of articles that will be written and updated periodically.
- **Portfolio**: A showcase of professional work, projects, and achievements, which will be updated less frequently.

Both sections require content to be displayed as static web pages to ensure fast load times, better SEO, and a smooth user experience. Several rendering strategies were considered, including Static Site Generation (SSG), Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and Client-Side Rendering (CSR). After evaluating the options, **SSG** was chosen as the preferred approach.

## Rendering Strategies: SSG vs SSR vs ISR vs CSR

### Static Site Generation (SSG)
- **How it works**: SSG pre-renders all pages at build time. The generated static HTML files are served to users without involving the server on each request.
- **Pros**:
  - **Fast performance**: Since pages are pre-built and served as static assets, the page load time is extremely fast.
  - **SEO-friendly**: SSG provides fully rendered HTML at load time, improving search engine discoverability.
  - **Scalability**: Static files can be hosted on CDNs like AWS S3, reducing server costs and handling large amounts of traffic easily.
  - **Low complexity**: SSG requires less infrastructure since pages don’t need to be dynamically generated for each request.
- **Cons**:
  - **Build times**: If the content grows significantly, the build times may become longer as all pages are regenerated at build time.
  - **Not ideal for real-time data**: SSG is not suitable for pages that frequently update or need to show real-time data.

### Server-Side Rendering (SSR)
- **How it works**: With SSR, pages are generated on the server for every request. The HTML is sent to the client on demand, and the server performs the necessary data fetching.
- **Pros**:
  - **Up-to-date content**: Pages are always served with the latest data.
  - **SEO-friendly**: Like SSG, SSR delivers pre-rendered HTML, improving SEO.
- **Cons**:
  - **Performance**: Since the server generates pages on each request, it results in slower performance compared to pre-rendered static pages.
  - **Infrastructure complexity**: SSR requires additional server infrastructure and load balancing to handle incoming requests, which increases costs and complexity.

### Incremental Static Regeneration (ISR)
- **How it works**: ISR combines the benefits of both SSG and SSR. Pages are pre-rendered at build time like SSG, but they can be regenerated at runtime when new content is added.
- **Pros**:
  - **Scalable with updated content**: ISR provides static content while allowing pages to be updated incrementally without requiring a full rebuild.
  - **Better performance than SSR**: Since most pages are served as static files, ISR is faster than SSR.
- **Cons**:
  - **Slightly increased complexity**: Implementing ISR requires setting up both static and dynamic rendering, and deciding when to regenerate pages can add complexity.
  - **Potential stale content**: There is a risk of serving stale content to users if pages are not regenerated frequently enough.

### Client-Side Rendering (CSR)
- **How it works**: With CSR, the HTML is generated entirely on the client-side using JavaScript. The browser downloads a minimal HTML page, and JavaScript renders the content.
- **Pros**:
  - **Real-time updates**: CSR is excellent for dynamic applications where content changes frequently, such as real-time data feeds or dashboards.
  - **Reduced server load**: Since the server does not need to render pages, CSR reduces the demand on server resources.
- **Cons**:
  - **Poor SEO**: CSR is not SEO-friendly because the initial HTML page contains minimal content, making it harder for search engines to index the page.
  - **Slower initial load**: Users experience a slower initial load time since they need to download and execute JavaScript before seeing any content.
  - **Higher complexity**: CSR requires more client-side code and handling various states, which can increase development effort.

## Decision
After comparing SSG, SSR, ISR, and CSR, **Static Site Generation (SSG)** was selected for the portfolio and blog for the following reasons:
- **Fast Performance**: Serving pre-generated static HTML files ensures that pages load quickly for users, especially since the blog and portfolio are mostly content-based pages that do not require frequent real-time updates.
- **SEO**: SSG offers the benefit of pre-rendered HTML, which is crucial for good search engine optimization and visibility.
- **Low Maintenance**: SSG reduces the need for complex server infrastructure, as the portfolio and blog can be hosted as static files on a CDN (e.g., AWS S3 or Netlify), making it easier to scale and deploy with fewer resources.
- **Simplicity**: The blog and portfolio content are not updated frequently enough to require the more complex infrastructure of SSR or ISR. SSG provides a straightforward and effective solution.

## Alternatives Considered
1. **SSR (Server-Side Rendering)**
   - Pros: Provides up-to-date content for every request and is SEO-friendly.
   - Cons: Adds complexity and increases server costs, with slower performance compared to SSG. Given the infrequent updates to the portfolio and blog, SSR was deemed unnecessary.

2. **ISR (Incremental Static Regeneration)**
   - Pros: Allows pages to be pre-rendered but updated over time without full rebuilds.
   - Cons: Introduces additional complexity for managing when and how pages are regenerated. The current content update frequency does not justify this complexity, making SSG a simpler choice.

3. **CSR (Client-Side Rendering)**
   - Pros: Best suited for applications requiring frequent real-time updates or highly interactive interfaces.
   - Cons: Poor SEO, slower initial load times, and more complex development effort. Since the portfolio and blog are primarily content-based, CSR is not appropriate for this project.

## Consequences
- **High Performance**: The portfolio and blog will have fast page load times due to pre-generated static files.
- **Ease of Deployment**: Static assets can be easily deployed to a CDN or static file hosting services, simplifying the deployment process.
- **Limited Real-Time Data**: While SSG is perfect for content that doesn’t change frequently, any real-time data would require alternative solutions like client-side hydration or periodic rebuilds if necessary in the future.
- **Static Nature**: Content updates will require a rebuild and redeployment of the site, but the frequency of updates is low, so this is not seen as a major downside.
