# UI/UX & Codebase Review — Zaid School

**الحالة:** partial — تحليل الكود كامل نسبيًا، وتحليل اللايف مبني على HTML/metadata والصفحات المنشورة. لم يتم تنفيذ اختبار بصري حقيقي على viewportات متعددة لأن `agent-browser` غير متاح في بيئة التنفيذ الحالية.

**النطاق:** الموقع العام، الصفحة الرئيسية، التصنيفات، صفحة الخبر، عن المدرسة، التنقل، التصميم العام، وقابلية إدارة المحتوى اللازمة لتحسين UX.

## Executive summary

المشروع سليم تقنيًا كأساس: Next.js App Router + TypeScript + Supabase، الصفحات العامة تُولّد HTML من الخادم، و`npm run lint` و`npm run build` ينجحان. المشكلة الأساسية ليست غياب مكونات UI، بل أن الهوية الحالية مشتتة بين مظهر "نشرة صحفية" ومظهر بوابة مدرسة، مع هرمية ضعيفة وتكرار واضح للمحتوى والتنقل.

أعلى عائد متوقع سيأتي من:

1. إعادة تعريف الـ visual direction والـ information architecture قبل تعديل الألوان والظلال.
2. إعادة بناء الـ masthead والـ homepage حول احتياجات ولي الأمر: الإعلانات العاجلة، المواعيد، التسجيل، النتائج، والتواصل.
3. استبدال الاعتماد على carousel كعنصر بطولي رئيسي بقسم أخبار رئيسي أكثر قابلية للفهم والسيطرة.
4. بناء نظام تصميم مركزي بدل تكرار Tailwind classes داخل كل مكون.
5. رفع جودة المحتوى والبيانات؛ النصوص التجريبية والصور العامة تجعل الموقع يبدو غير رسمي حتى لو كان التنفيذ التقني جيدًا.

## Evidence map

| الدليل | المصدر |
|---|---|
| الهوية الحالية تعتمد `ink/paper/gold/maroon/teal` وثلاثة خطوط خارجية | `app/globals.css:1-72` |
| رأس الصفحة قد يأخذ 140–320px للّوجو وحده | `components/Masthead.tsx:10-25` |
| يوجد تنقل رئيسي داخل الـ masthead، وتنقل sticky، وquick links مكرر في الصفحة الرئيسية | `components/MastheadNav.tsx:16-66`, `components/StickyHeader.tsx:29-55`, `app/(public)/page.tsx:57-69` |
| الصفحة الرئيسية تجمع carousel + lead card + compact list + 5 category sections + notice board | `app/(public)/page.tsx:71-111` |
| الـ carousel يعرض 4 أخبار، auto-play كل 6 ثوان، مع صور overlay ونص فوق الصورة | `components/HeroCarousel.tsx:10-168` |
| كل بطاقة خبر تقريبًا white card + border + shadow، والعناوين تستخدم Lalezar | `components/NewsCard.tsx:8-40` |
| التصنيف يعيد عرض شبكة بطاقات بدون أدوات فلترة/بحث/ترقيم | `app/(public)/category/[category]/page.tsx:76-96` |
| صفحة الخبر تعرض title/date/share/image/content/gallery فقط | `app/(public)/news/[slug]/page.tsx:113-164` |
| لوحة التحكم تعتمد على نفس style primitives البسيطة وليست workflow موجهًا للمحرر | `app/admin/layout.tsx:1-14`, `components/admin/AdminNav.tsx:4-29` |
| الموقع المنشور يصف نفسه بأنه "نشرة الأخبار الرسمية" ويعرض 5 quick links وcarousel ثم أقسام الأخبار | live `/` HTML, 2026-08-30 |
| live `/about` يعرض فقرة تعريفية قصيرة وFacebook group وإهداء فقط؛ لا توجد معلومات تشغيلية مفيدة حاليًا | live `/about` HTML |
| live `/category/school` يعرض 4 أخبار فقط بلا أدوات scan أو pagination | live `/category/school` HTML |
| live article يعرض نص الخبر بلا summary box أو related content أو CTA واضح | live `/news/fath-bab-altasjil-lil-aam-aldirasi-aljadid` HTML |

## Findings — priority ranked

### P0 — لا يوجد تعريف واضح للمنتج

**المشكلة:** الموقع يتصرف كـ news bulletin بينما احتياجات الجمهور الأساسية مدرسية/خدمية. عبارة "نشرة الأخبار الرسمية" هي الرسالة الأوضح حاليًا، لكن homepage لا تعطي أولوية صريحة للتسجيل، الجدول، النتائج، التواصل، أو التعليمات.

**الأثر:** الزائر لا يعرف خلال ثوانٍ ماذا يمكنه أن يفعل، والموقع يبدو كمدونة أخبار عامة بدل بوابة موثوقة للمدرسة.

**المعالجة:** اعتماد positioning: "البوابة الرسمية لمجتمع المدرسة"، مع تقسيم واضح إلى أخبار، إعلانات مهمة، خدمات أولياء الأمور، عن المدرسة/تواصل معنا.

### P0 — الـ masthead يستهلك مساحة ضخمة ويؤخر المحتوى

`Masthead.tsx:10-25` يخصص حتى 320px لعرض logo image باستخدام `object-contain`، ثم يعرض اسم المدرسة، subtitle، issue line، nav، ثم sticky header إضافي.

**الأثر:** على desktop قد يرى المستخدم branding أكثر من المحتوى؛ على mobile يزداد vertical scroll قبل أول خبر، خصوصًا مع وجود رأس ثابت لاحقًا.

**المعالجة:** header compact بارتفاع ثابت، logo صغير داخل brand lockup، announcement strip اختياري، وnav واحد فقط. إذا كان هناك hero branding، يكون خلفية/صورة محسوبة وليس مساحة فارغة حول الشعار.

### P0 — تكرار التنقل يسبب ضوضاء ويضعف التسلسل البصري

يوجد nav داخل masthead، sticky nav، وquick links بنفس التصنيفات في بداية home.

**الأثر:** ثلاث نسخ لنفس المسارات، وعدم وضوح ما إذا كانت quick links filters أم navigation. هذا يجعل الصفحة تبدو مصممة من مكونات منفصلة لا من نظام واحد.

**المعالجة:** اختيار نمط واحد: desktop header nav + mobile drawer، ثم quick actions مختلفة وظيفيًا (التسجيل، النتائج، الجداول، تواصل معنا)، وليس نسخ التصنيفات.

### P1 — carousel هو نقطة الدخول الأساسية رغم أنه الأقل قابلية للاكتشاف

`HeroCarousel.tsx:25-54` يعتمد على auto-play، و`HeroCarousel.tsx:65-89` يضع كل محتوى الخبر كرابط full-bleed فوق صورة. التحكم موجود لكنه رمزي (`‹`, `›`, `⏸`, `▶`) ولا يعرض excerpt أو CTA.

**الأثر:** المستخدم قد يفوّت الإعلان المهم، النص فوق الصور قد تتأثر قراءته بجودة/سطوع الصورة، والمحتوى المخفي خلف الشرائح لا يمكن scan له بسهولة.

**المعالجة:** اجعل hero ثابتًا لخبر/إعلان واحد مع عنوان وexcerpt وCTA، وبجانبه قائمة "أحدث الأخبار" أو "الأهم الآن". إن بقي carousel فليكن ثانويًا، بدون auto-play افتراضيًا، مع pause واضح ونصوص قابلة للقراءة.

### P1 — الصفحة الرئيسية طويلة ومكررة وغير موجهة

`app/(public)/page.tsx:71-111` يعرض نفس الأخبار في مسارات متعددة: carousel، lead/side، category sections، notice board.

**الأثر:** كثافة عالية مع شعور بالتكرار، بينما أهم المعلومات لا تملك مساحة/label خاصًا بها.

**المعالجة:** homepage مقترحة: announcement strip → hero/primary action → 3 service tiles → latest news grid → events/upcoming dates → about/contact footer. حد أقصى واضح لعدد مرات ظهور الخبر في الصفحة.

### P1 — اللغة والمحتوى يقللان الثقة

البيانات المنشورة تتضمن عناوين مثل "هاااام"، نصوص تجريبية، صور Unsplash عامة، وصياغة مختلطة مثل "الرسميه". صفحة `/about` تذكر وصفًا عامًا دون عنوان/هاتف/ساعات عمل فعلية.

**الأثر:** حتى مع visual polish، سيبدو الموقع غير رسمي أو placeholder.

**المعالجة:** إضافة content checklist في لوحة الإدارة: title واضح، summary مفيد، audience، date/time/location، attachment/CTA عند الحاجة، صورة حقيقية أو placeholder branded. مراجعة اللغة العربية وتوحيد كتابة اسم المدرسة.

### P1 — صفحة الخبر لا تدعم القراءة أو الإجراء التالي بما يكفي

`app/(public)/news/[slug]/page.tsx:113-164` يعرض metadata قليلة، نصًا طويلًا، معرضًا إن وجد، ومشاركة. لا توجد قراءة تقديرية، summary، related news، previous/next، أو CTA مثل "عودة للإعلانات".

**المعالجة:** article header أقوى، summary panel، facts row (التاريخ/المكان/الفئة)، body typography مضبوط، related content، share actions بأيقونات ونص، وback-to-category CTA.

### P1 — نظام التصميم غير مركزي

الألوان والخطوط tokens جزئيًا في `globals.css`، لكن معظم المكونات تبني الشكل مباشرة بـ utility strings. لا توجد primitives موحدة لـ Button/Card/Badge/SectionHeader/Container، ولا حالات design موحدة.

**الأثر:** أي redesign سيحتاج تعديل عشرات السلاسل، مع خطر اختلاف spacing/radius/focus/hover بين الصفحات.

**المعالجة:** إنشاء `components/ui` وtokens واضحة: `Container`, `Button`, `IconButton`, `Card`, `Badge`, `SectionHeader`, `Prose`, `EmptyState`. أبقِ Tailwind للتخطيط، واجعل المظهر المشترك في primitives.

### P2 — فرص accessibility موجودة لكن ناقصة

هناك skip link وfocus-visible وRTL وreduced-motion، وهي نقاط جيدة. لكن gallery الصور غير قابلة للتكبير/التفاعل، وalt فارغ في `ArticleGallery.tsx:19`، وdrawer لا يطبق focus trap كاملًا، وبعض الأزرار تعتمد على رموز فقط.

**المعالجة:** lightbox accessible، alt/معنى للصور، focus trap، Escape/backdrop، labels مرئية أو tooltips، واختبار keyboard + screen reader.

### P2 — البيانات لا تدعم UX المستهدف

`NewsItem` في `lib/types.ts:3-16` لا يحتوي event date/time/location، priority/pinned، audience، CTA URL، attachment، أو cover image alt. لذلك لا يمكن بناء "أهم الآن" أو calendar/notice cards بجودة بدون توسيع النموذج.

**المعالجة:** migration additive لهذه الحقول مع backward-compatible defaults، ثم تحديث نموذج الإدارة وواجهات العرض.

### P2 — إدارة الأخبار تحتاج workflow تحرير أفضل

لوحة الإدارة محمية بالمصادقة، لكن سياسة RLS الحالية في `supabase/migration.sql:34-45` تسمح لأي authenticated user بصلاحيات كاملة، وواجهة الإدارة تبدو CRUD مباشرة.

**المعالجة:** فصل role/permission لاحقًا، وتحسين workflow: draft/preview/publish/schedule، validation، image guidance، confirmation، success/error feedback. هذا ضمن UX للإدارة وليس تجميلًا فقط.

## نقاط قوة يجب الحفاظ عليها

- Server-rendered public HTML وISR (`revalidate = 60`) مناسب لموقع الأخبار.
- RTL صحيح في `app/layout.tsx:43`.
- skip link، focus-visible، reduced-motion، وlabels أساسية للـ carousel موجودة.
- `SafeImage` وNext Image وremote image configuration يوفران أساسًا جيدًا للصور.
- SEO metadata، sitemap، robots، JSON-LD، وcanonical موجودة بالفعل.
- فصل الصفحات العامة عن admin واضح.

## الخطة المقترحة

### Phase 0 — Discovery & direction (نصف يوم إلى يوم)

- تحديد personas: ولي الأمر، الطالب، المعلم/الإدارة، زائر عام.
- اعتماد sitemap جديد و3 user journeys: الوصول لإعلان عاجل، قراءة خبر، الوصول لمعلومة تواصل/تسجيل.
- جمع الهوية المتاحة: logo source، ألوان المدرسة، صور حقيقية، بيانات الاتصال، روابط الخدمات.
- اعتماد visual direction واحد قبل التنفيذ: رسمي دافئ/تعليمي مع white space وaccent واحد أساسي، بدل newspaper collage الحالي.

**مخرج:** mini design brief + sitemap + content priorities.

### Phase 1 — Design system foundation (يوم إلى يومين)

- توحيد font strategy؛ اختبار Lalezar للعناوين فقط وتجنب استخدامه في عناوين طويلة جدًا إن أثر على القراءة.
- إنشاء tokens للـ color, spacing, radius, shadow, type scale, content width.
- إنشاء UI primitives: Button, Card, Badge, SectionHeader, Container, IconButton, EmptyState.
- إضافة states موحدة: hover/focus/disabled/loading/error.
- تعريف responsive breakpoints ومقاسات القراءة والصور.

**مخرج:** صفحة style reference داخلية + primitives قابلة لإعادة الاستخدام.

### Phase 2 — Header/navigation/mobile shell (يوم إلى يومين)

- استبدال masthead الكبير بـ compact header.
- إزالة nav duplication؛ quick actions تصبح خدمات فعلية.
- إعادة بناء mobile drawer مع focus trap وإغلاق واضح.
- إضافة active states وbreadcrumb مختصر، وربط logo/brand بصورة محسوبة.

**مخرج:** shell موحد لكل public routes.

### Phase 3 — Homepage redesign (يومان إلى ثلاثة)

- alert/announcement bar للإعلانات المهمة.
- hero ثابت أو featured block واحد مع excerpt وCTA.
- service tiles: التسجيل، النتائج، الجداول، التواصل (تظهر فقط إذا كان لها data/link فعلي).
- latest news grid مع hierarchy واضح.
- upcoming events/notice module بدل لوحة الورق المائلة إذا لم تكن الهوية المرغوبة.
- إزالة تكرار الخبر على أكثر من section، وضبط empty states.

**مخرج:** home responsive + visual QA على 375/768/1280px.

### Phase 4 — Category & article experience (يومان)

- category header يوضح العدد/الفترة إن أمكن، مع filter/search أو pagination عند نمو المحتوى.
- cards موحدة، image fallback branded، metadata قابلة للمسح.
- article summary/facts/CTA/related articles/previous-next.
- gallery lightbox accessible وalt text.

**مخرج:** content discovery وreading flow مكتمل.

### Phase 5 — Content model + admin UX (يومان إلى ثلاثة)

Migration additive: `priority`, `pinned`, `event_at`, `location`, `audience`, `cta_label`, `cta_url`, `image_alt`, وربما `status` بدل boolean على المدى المتوسط.

- preview قبل النشر.
- حقول conditional حسب category.
- validation ورسائل نجاح/فشل واضحة.
- تحسين رفع الصور: crop/aspect guidance، preview، alt text، size/type validation.
- role/permission hardening كمسار أمني منفصل.

### Phase 6 — QA & measurement (يوم إلى يومين)

- اختبار keyboard وRTL وmobile menu وcarousel/gallery.
- Lighthouse/axe/Playwright أو agent-browser عند توفره.
- قياس Core Web Vitals، حجم الصور، LCP، CLS، ووقت أول تفاعل.
- visual regression للـ 3 viewportات.
- اختبار محتوى حقيقي: عنوان طويل، خبر بلا صورة، صورة portrait، 0 أخبار، 50 خبرًا، نص عربي طويل.

## Acceptance criteria للـ redesign

- المستخدم يعرف هوية الموقع ووظيفته خلال 5 ثوانٍ من فتح home.
- الوصول إلى أي فئة أو خدمة أساسية من أول viewport بدون تكرار nav.
- أول خبر/إعلان قابل للقراءة على 375px بدون قص/تداخل.
- لا يظهر الخبر نفسه أكثر من مرة في نفس viewport إلا إذا كان هناك سبب وظيفي واضح.
- كل interactive element قابل للـ keyboard وله focus state واضح.
- لا يعتمد المحتوى الأساسي على auto-play أو hover.
- صفحة الخبر تقدم title + summary/metadata + body + next action.
- الصور الحقيقية لها alt مفيد، والصور الزخرفية فقط alt فارغ.
- lint/build يظلان ناجحين، وLighthouse accessibility لا يقل عن 90 كهدف أولي.

## تنفيذ هذه الجولة

تم تنفيذ Phase 1 إلى Phase 5 بصريًا/تفاعليًا على الكود الحالي:

- تقليص وإعادة بناء public masthead وإزالة quick-links المكررة.
- إضافة design primitives بسيطة (`SectionHeading`, `ServiceLinks`) وتوحيد شكل البطاقات والأقسام.
- إعادة ترتيب homepage وإضافة announcement bar وخدمات الوصول السريع.
- تحسين carousel ليبدأ متوقفًا، مع excerpt وCTA وتحكم أوضح.
- تحسين category pages وarticle reading flow وrelated news.
- إضافة gallery lightbox accessible.
- تحسين footer/about/admin shell/admin table/login.

لم يتم تنفيذ migration لحقول جديدة أو تغيير صلاحيات Supabase؛ ذلك يحتاج بيانات تشغيلية مؤكدة وسياسة صلاحيات منفصلة.

## Recommended next workflow

1. اعتماد Phase 0 والـ visual direction.
2. كتابة PRD-lite مختصر للموقع الرسمي كـ school portal.
3. تنفيذ design system ثم shell قبل homepage.
4. بعد اعتماد shell، تنفيذ homepage ثم article/category.
5. تشغيل implementation-readiness قبل أي migration أو إعادة كتابة كبيرة.

## Validation gaps

- لا توجد screenshots/recording من mobile وdesktop ضمن هذه المراجعة.
- لا يوجد اختبار فعلي لتجربة admin بعد login.
- لا توجد analytics أو بيانات بحث/أكثر صفحات زيارة لتأكيد الأولويات.
- live content الحالي يبدو seed/demo content؛ يجب تأكيد المحتوى والهوية قبل تثبيت التصميم النهائي.
