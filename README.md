1 Change baseHref
 "baseHref": "./",
 "baseHref": "/",

2 Keep src/index.html
You already changed it correctly:

base href="/" 

Keep it.

3 Keep your config
Keep:

public/staticwebapp.config.json

with:

{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": [
      "/*.js",
      "/*.css",
      "/*.json",
      "/*.ico",
      "/*.png",
      "/*.svg",
      "/*.jpg",
      "/*.jpeg",
      "/*.gif",
      "/*.webp",
      "/*.woff",
      "/*.woff2",
      "/*.ttf",
      "/*.eot",
      " "/*.webmanifest",
      "/assets/*"
    ]
  }
}

Remove the accidental space if you copy the above — the line should be:

"/*.webmanifest",

4 Change your favicon
I also recommend changing:

href="assets/images/logos/logo.png"

to:

href="/assets/images/logos/logo.png"

So:



This isn't the main issue, but it prevents exactly the /viewer/assets/... problem you're seeing.

5 Delete your old build
In PowerShell:

Remove-Item -Recurse -Force dist

Then build again:

ng build

This is important because we want a completely fresh build.

6 Check the generated index.html
After the build, open:

dist/axisxd-angular/browser/index.html

Look at the bottom.

You should see generated files referenced from the root, for example:


and not:


The base href="/" should also be present.

7 Azure output location
You told me your build creates:

dist/axisxd-angular/browser/

Therefore your Azure Static Web Apps workflow needs:

output_location: "dist/axisxd-angular/browser"

This is critical.

The complete fix
You currently have:

angular.json
    ↓
baseHref: "./"     ❌
    ↓
Angular generates relative resource URLs
    ↓
/viewer/point-cloud
    ↓
browser looks for /viewer/main.js
    ↓
404
    ↓
white page

Change it to:

angular.json
    ↓
baseHref: "/"      ✅
    ↓
Angular generates root-based resource URLs
    ↓
/viewer/point-cloud
    ↓
browser loads /main.js
    ↓
Angular Router loads /viewer/point-cloud
    ↓
Page works

Your most important change is literally this one line:
 "baseHref": "./",
"baseHref": "/",

step1: add staticwebapp.config.json file in public with some code
step2: change base url in index.html and angular.json files
step3: azure deployement conditions in above 
# axisxd-v2.0
