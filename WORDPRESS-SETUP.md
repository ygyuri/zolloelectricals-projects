# Serve Projects at zolloelectricals.com/projects/ (WordPress)

**Vercel app:** https://zolloelectricals-projects.vercel.app

## Steps (no plugin)

1. In WordPress: **Pages → Add New**.
2. **Title:** `Projects`.
3. Set the **permalink slug** to `projects` so the URL is `https://zolloelectricals.com/projects/`.
4. Add a **Custom HTML** block and paste:

```html
<iframe
  src="https://zolloelectricals-projects.vercel.app"
  title="Our Projects"
  style="width:100%; height:100vh; min-height:800px; border:none; display:block;"
></iframe>
```

5. **Publish.**

Visiting **https://zolloelectricals.com/projects/** will show the Vercel projects page inside the WordPress page.
