-- Temporary rich demo content for UI/UX testing. Safe to rerun by slug.

update news set image_alt = 'طلاب داخل فصل أثناء إعلان نتائج الامتحانات' where slug = 'natayij-aimtihanat-muntasaf-alfasl-aldirasii-alawal';
update news set image_alt = 'لقاء مدرسي مخصص لأولياء الأمور' where slug = 'jalsat-taerifiat-liawlia-alumur-hawl-aleam-aldirasii';
update news set image_alt = 'قاعة قراءة داخل مكتبة كبيرة' where slug = 'rihlat-taelimiat-iilaa-maktabat-aliiskandaria';
update news set image_alt = 'طلاب يقرؤون في ساحة المدرسة' where slug = 'iitlaq-mubadarat-alqiraat-alhurat-alasbueia';
update news set image_alt = 'طالب يكتب بخط اليد على ورق' where slug = 'takrim-alfayizin-fi-musabaqat-alkhati-alearabii';

update news set image_url = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=675&fit=crop', image_alt = 'طلاب يتعاونون داخل بيئة تعليمية' where slug = 'fath-bab-altasjil-lil-aam-aldirasi-aljadid';
update news set image_url = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=675&fit=crop', image_alt = 'دفتر ومستلزمات لتنظيم الجدول الدراسي' where slug = 'ietimad-aljadwal-aldirasi-lilfasl-alawal';
update news set image_url = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=675&fit=crop', image_alt = 'طلاب داخل معمل العلوم' where slug = 'natayij-maerid-aleulum-almadrasii-lhdha-aleam';
update news set image_url = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=675&fit=crop', image_alt = 'مجموعة طلاب في فعالية تعارف' where slug = 'yawm-alaistiqbal-waltaearuf-liltalaba-aljudud';
update news set image_url = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=675&fit=crop', image_alt = 'حاسب محمول داخل معمل تعليمي' where slug = 'aiftitah_maml_alhasib_alaly_aljadid';

insert into news (title, slug, excerpt, content, category, image_url, image_alt, published, featured_in_carousel, pinned, priority, event_at, location, audience, cta_label, cta_url, created_at)
values
('بدء التسجيل في الأنشطة الصيفية', 'demo-summer-activities-registration', 'تفتح المدرسة باب التسجيل في برنامج الأنشطة الصيفية الذي يجمع بين الرياضة والفنون والمهارات الرقمية.', E'تعلن إدارة المدرسة عن بدء التسجيل في برنامج الأنشطة الصيفية للطلاب من مختلف المراحل.\n\nيتضمن البرنامج تدريبات رياضية وورش رسم ومسرحًا وأنشطة للبرمجة والروبوتات، بإشراف معلمي المدرسة ومتخصصين.\n\nالأماكن محدودة، وسيتم توزيع الطلاب على مجموعات عمرية لضمان أفضل استفادة.', 'announcements', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&h=675&fit=crop', 'طلاب يشاركون في نشاط فني جماعي', true, true, true, 3, now() + interval '12 days', 'مبنى الأنشطة بالمدرسة', 'الطلاب وأولياء الأمور', 'عرض تفاصيل الأنشطة', 'https://zaid-school.vercel.app/category/events', now() + interval '2 hours'),
('لقاء أولياء الأمور مع إدارة المدرسة', 'demo-parent-school-meeting', 'لقاء مفتوح لمناقشة خطة الفصل الدراسي والإجابة عن استفسارات أولياء الأمور.', E'تدعو إدارة المدرسة أولياء الأمور إلى لقاء مفتوح لمناقشة الخطة التعليمية والأنشطة وآليات التواصل خلال الفصل الدراسي.\n\nيتضمن اللقاء عرضًا موجزًا من الإدارة، ثم جلسات منفصلة مع منسقي المراحل والمعلمين.\n\nيرجى الحضور قبل الموعد بخمس عشرة دقيقة لتسجيل البيانات.', 'events', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&h=675&fit=crop', 'أولياء أمور في لقاء تعريفي', true, true, true, 2, now() + interval '7 days', 'القاعة الكبرى', 'أولياء الأمور', null, null, now() - interval '1 hour'),
('فريق المدرسة يتأهل لنهائي دوري كرة القدم', 'demo-football-team-final', 'حقق فريق المدرسة فوزًا مستحقًا وتأهل إلى المباراة النهائية في بطولة المدارس الرسمية.', E'تأهل فريق المدرسة إلى نهائي دوري كرة القدم بعد مباراة قوية اتسمت بالروح الرياضية والتنظيم.\n\nتتقدم الإدارة بالتهنئة إلى اللاعبين والجهاز الفني، وتدعو الطلاب إلى دعم زملائهم في المباراة النهائية.\n\nسيتم إعلان ترتيبات الحضور فور اعتمادها من اللجنة المنظمة.', 'contests', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=675&fit=crop', 'فريق كرة قدم مدرسي داخل الملعب', true, true, false, 2, now() + interval '5 days', 'ملعب الإدارة التعليمية', 'الطلاب والمعلمون', null, null, now() - interval '5 hours'),
('إعلان نتيجة مسابقة أوائل الطلبة', 'demo-top-students-results', 'إعلان أسماء الفرق الفائزة في مسابقة أوائل الطلبة على مستوى المراحل التعليمية.', E'اختتمت المدرسة مسابقة أوائل الطلبة بمشاركة فرق من جميع المراحل.\n\nشهدت المسابقة منافسة متميزة في العلوم والرياضيات واللغات والمعلومات العامة.\n\nسيتم تكريم الطلاب الفائزين خلال طابور الصباح وتسليمهم شهادات تقدير.', 'results', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=675&fit=crop', 'طلاب يحتفلون بالنجاح في ساحة تعليمية', true, false, false, 2, null, null, 'الطلاب وأولياء الأمور', null, null, now() - interval '1 day'),
('افتتاح مكتبة المدرسة بعد التطوير', 'demo-library-reopening', 'افتتاح المكتبة بحلتها الجديدة مع قاعة قراءة وركن للأطفال ومصادر رقمية.', E'انتهت أعمال تطوير مكتبة المدرسة لتقدم للطلاب تجربة قراءة وبحث أكثر راحة.\n\nتضم المكتبة مجموعة جديدة من الكتب العربية والإنجليزية، إلى جانب أجهزة للوصول إلى المصادر التعليمية الرقمية.\n\nستعمل المكتبة طوال اليوم الدراسي وفق جدول الزيارات المعلن لكل فصل.', 'school', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=675&fit=crop', 'رفوف كتب داخل مكتبة حديثة', true, true, false, 1, null, 'مكتبة المدرسة', 'جميع الطلاب', null, null, now() - interval '2 days'),
('ورشة الروبوتات والبرمجة للمرحلة الإعدادية', 'demo-robotics-workshop', 'ورشة عملية لتصميم نماذج روبوتية بسيطة وتعلم مبادئ البرمجة وحل المشكلات.', E'ينظم قسم الحاسب الآلي ورشة للروبوتات والبرمجة موجهة إلى طلاب المرحلة الإعدادية.\n\nيتعلم الطلاب خلال الورشة تركيب المكونات وبرمجة الحساسات وتنفيذ تحديات جماعية.\n\nلا يشترط وجود خبرة سابقة، وسيتم توفير الأدوات داخل المعمل.', 'events', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=675&fit=crop', 'روبوت تعليمي على مكتب', true, false, false, 1, now() + interval '15 days', 'معمل الحاسب الآلي', 'طلاب المرحلة الإعدادية', null, null, now() - interval '3 days'),
('تنبيه بشأن مواعيد الحضور والانصراف', 'demo-attendance-times-notice', 'تذكير بالمواعيد الرسمية للحضور والانصراف وضرورة الالتزام ببوابات كل مرحلة.', E'تنبه إدارة المدرسة إلى أهمية الالتزام بمواعيد الحضور والانصراف حفاظًا على انتظام اليوم الدراسي وسلامة الطلاب.\n\nتفتح البوابات قبل بداية الطابور بنصف ساعة، ويبدأ الانصراف وفق الجدول المعتمد لكل مرحلة.\n\nيرجى عدم التكدس أمام البوابات واتباع تعليمات مسؤولي الأمن.', 'announcements', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=675&fit=crop', 'تقويم ومفكرة لتنظيم المواعيد', true, false, false, 2, null, 'بوابات المدرسة', 'أولياء الأمور والطلاب', null, null, now() - interval '4 days'),
('تكريم حفظة القرآن الكريم', 'demo-quran-memorization-honoring', 'احتفالية لتكريم الطلاب المتميزين في مسابقة حفظ القرآن الكريم وتجويده.', E'نظمت المدرسة احتفالية لتكريم الطلاب الفائزين في مسابقة حفظ القرآن الكريم وتجويده.\n\nشارك في المسابقة طلاب من مختلف المراحل تحت إشراف معلمي التربية الدينية.\n\nقدمت الإدارة شهادات تقدير وجوائز رمزية للفائزين والمشاركين.', 'contests', 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200&h=675&fit=crop', 'مصحف مفتوح في إضاءة هادئة', true, false, false, 1, null, 'مسرح المدرسة', 'مجتمع المدرسة', null, null, now() - interval '5 days'),
('نتائج تقييم شهر أكتوبر', 'demo-october-assessment-results', 'إتاحة نتائج التقييم الشهري للطلاب مع توجيهات لمتابعة الأداء الأكاديمي.', E'تم اعتماد نتائج تقييم شهر أكتوبر لجميع الصفوف، ويمكن لأولياء الأمور مراجعة النتيجة من خلال إدارة شؤون الطلاب.\n\nتؤكد المدرسة أن التقييم الشهري أداة لمتابعة تقدم الطالب وتحديد نقاط القوة والجوانب التي تحتاج دعمًا.\n\nسيتم التواصل مع أولياء الأمور عند الحاجة إلى خطة متابعة فردية.', 'results', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=675&fit=crop', 'طالب يكتب ملاحظات دراسية', true, false, false, 2, null, 'شؤون الطلاب', 'الطلاب وأولياء الأمور', null, null, now() - interval '6 days'),
('حملة تشجير وتجميل فناء المدرسة', 'demo-school-garden-campaign', 'طلاب المدرسة يشاركون في زراعة الأشجار وتجميل الفناء ضمن مبادرة الاستدامة.', E'شارك الطلاب والمعلمون في حملة لتشجير وتجميل فناء المدرسة، ضمن مبادرة لتعزيز السلوك البيئي الإيجابي.\n\nتضمنت الحملة زراعة أشجار ونباتات مناسبة للبيئة المحلية، وإعادة تنظيم المساحات الخضراء.\n\nستتولى جماعة البيئة متابعة النباتات بالتعاون مع مسؤولي المدرسة.', 'school', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=675&fit=crop', 'نباتات خضراء في حديقة مدرسية', true, false, false, 1, null, 'فناء المدرسة', 'جميع الطلاب', null, null, now() - interval '7 days'),
('المركز الأول في مسابقة الخط العربي', 'demo-arabic-calligraphy-first-place', 'طالب من المدرسة يحقق المركز الأول في مسابقة الخط العربي على مستوى الإدارة.', E'تتقدم إدارة المدرسة بالتهنئة إلى الطالب الفائز بالمركز الأول في مسابقة الخط العربي.\n\nتميز العمل بالدقة وجمال التكوين والالتزام بقواعد الخط، وحصل على إشادة لجنة التحكيم.\n\nسيتم عرض اللوحة الفائزة في مدخل المدرسة خلال الأسبوع القادم.', 'results', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=675&fit=crop', 'يد تكتب بقلم على ورق', true, false, false, 1, null, null, 'مجتمع المدرسة', null, null, now() - interval '8 days'),
('زيارة تعليمية إلى متحف العلوم', 'demo-science-museum-visit', 'رحلة تعليمية تربط المناهج العلمية بالتجارب التفاعلية داخل متحف العلوم.', E'تنظم المدرسة زيارة تعليمية إلى متحف العلوم لطلاب المرحلة الإعدادية.\n\nتشمل الزيارة جولة في قاعات الطاقة والفضاء وجسم الإنسان، إلى جانب تجارب تفاعلية بإشراف متخصصين.\n\nسيتم توزيع استمارات الموافقة وتعليمات الرحلة على الطلاب.', 'events', 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=1200&h=675&fit=crop', 'معروضات علمية داخل متحف', true, false, false, 1, now() + interval '20 days', 'متحف العلوم', 'طلاب المرحلة الإعدادية', null, null, now() - interval '9 days'),
('تحديث بيانات الطلاب للعام الدراسي', 'demo-student-data-update', 'دعوة أولياء الأمور لمراجعة أرقام الهاتف والعناوين وبيانات التواصل المسجلة.', E'تدعو المدرسة أولياء الأمور إلى مراجعة وتحديث بيانات الطلاب لضمان سرعة التواصل في الحالات المهمة.\n\nتشمل البيانات المطلوبة رقم الهاتف والعنوان والبريد الإلكتروني واسم الشخص المخول باستلام الطالب.\n\nيتم التحديث من خلال شؤون الطلاب خلال مواعيد العمل الرسمية.', 'announcements', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=675&fit=crop', 'مستندات ونماذج بيانات على مكتب', true, false, false, 1, null, 'شؤون الطلاب', 'أولياء الأمور', null, null, now() - interval '10 days'),
('معرض الفنون السنوي للطلاب', 'demo-annual-art-exhibition', 'عرض أعمال الطلاب في الرسم والتصوير والأشغال الفنية بحضور الأسر والمعلمين.', E'يفتتح قسم التربية الفنية معرضه السنوي الذي يضم مجموعة متنوعة من أعمال الطلاب.\n\nيعكس المعرض مهارات الطلاب في الرسم والتلوين والتصميم وإعادة التدوير.\n\nالدعوة مفتوحة لأولياء الأمور لزيارة المعرض وتشجيع المبدعين.', 'contests', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=675&fit=crop', 'لوحات فنية ملونة داخل معرض', true, false, false, 1, now() + interval '10 days', 'قاعة الفنون', 'مجتمع المدرسة', null, null, now() - interval '11 days'),
('تطوير معامل اللغات بالمدرسة', 'demo-language-labs-upgrade', 'تحديث معامل اللغات بسماعات وشاشات ومواد تفاعلية لدعم مهارات الاستماع والمحادثة.', E'استكملت المدرسة تطوير معامل اللغات وتزويدها بأجهزة حديثة ومواد تعليمية تفاعلية.\n\nيتيح التطوير للطلاب التدريب بصورة أفضل على الاستماع والنطق والمحادثة داخل مجموعات صغيرة.\n\nيبدأ تشغيل المعامل وفق الجدول الجديد اعتبارًا من الأسبوع المقبل.', 'school', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=675&fit=crop', 'معلم وطلاب داخل فصل حديث', true, false, false, 1, null, 'معامل اللغات', 'جميع الطلاب', null, null, now() - interval '12 days')
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  image_url = excluded.image_url,
  image_alt = excluded.image_alt,
  published = excluded.published,
  featured_in_carousel = excluded.featured_in_carousel,
  pinned = excluded.pinned,
  priority = excluded.priority,
  event_at = excluded.event_at,
  location = excluded.location,
  audience = excluded.audience,
  cta_label = excluded.cta_label,
  cta_url = excluded.cta_url;

-- Rebuild demo galleries deterministically so this seed remains safe to rerun.
delete from news_images
where news_id in (
  select id from news where slug in (
    'demo-library-reopening',
    'demo-robotics-workshop',
    'demo-annual-art-exhibition'
  )
);

insert into news_images (news_id, image_url, sort_order)
select news.id, gallery.image_url, gallery.sort_order
from news
cross join lateral (
  values
    ('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=900&fit=crop', 0),
    ('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=900&fit=crop', 1),
    ('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=1200&h=900&fit=crop', 2)
) as gallery(image_url, sort_order)
where slug = 'demo-library-reopening';

insert into news_images (news_id, image_url, sort_order)
select news.id, gallery.image_url, gallery.sort_order
from news
cross join lateral (
  values
    ('https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&h=900&fit=crop', 0),
    ('https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1200&h=900&fit=crop', 1),
    ('https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=900&fit=crop', 2)
) as gallery(image_url, sort_order)
where slug = 'demo-robotics-workshop';

insert into news_images (news_id, image_url, sort_order)
select news.id, gallery.image_url, gallery.sort_order
from news
cross join lateral (
  values
    ('https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&h=900&fit=crop', 0),
    ('https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1200&h=900&fit=crop', 1),
    ('https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1200&h=900&fit=crop', 2)
) as gallery(image_url, sort_order)
where slug = 'demo-annual-art-exhibition';
