# راهنمای ساخت توکن دسترسی گیت‌هاب (فارسی)

این راهنما نحوه ساخت توکن دسترسی شخصی (Personal Access Token) گیت‌هاب با دسترسی کامل به تمام سرویس‌های گیت‌هاب شامل Copilot Pro، Codespaces، Agents، MCP Server و سایر امکانات را توضیح می‌دهد.

## نکات امنیتی مهم ⚠️

**هشدارهای امنیتی حیاتی:**

- **هرگز** توکن‌ها را در مخازن Git ذخیره نکنید
- **هرگز** توکن‌ها را در کانال‌های عمومی به اشتراک نگذارید
- **هرگز** توکن‌ها را در فایل‌های متنی ساده ذخیره نکنید
- توکن‌ها را در مدیران رمز عبور امن یا متغیرهای محیطی ذخیره کنید
- توکن‌ها را به طور منظم تغییر دهید (توصیه می‌شود هر ۹۰ روز)
- برای هر منظور از توکن جداگانه استفاده کنید
- به طور منظم توکن‌های استفاده نشده را بررسی و لغو کنید

## مراحل ساخت توکن دسترسی

### مرحله ۱: دسترسی به تنظیمات توکن

1. به **[GitHub.com](https://github.com)** وارد شوید
2. روی **تصویر پروفایل** خود در گوشه بالا سمت راست کلیک کنید
3. **Settings** را انتخاب کنید
4. به پایین اسکرول کنید و **Developer settings** را انتخاب کنید (پایین نوار سمت چپ)
5. روی **Personal access tokens** کلیک کنید
6. یکی از موارد زیر را انتخاب کنید:
   - **Fine-grained tokens** (توصیه می‌شود برای توکن‌های جدید)
   - **Tokens (classic)** (برای سازگاری گسترده‌تر)

### مرحله ۲: ساخت توکن جدید

#### برای Fine-grained Tokens:

1. روی **Generate new token** → **Fine-grained token** کلیک کنید
2. یک **Token name** وارد کنید: مثلاً "Full Access Development Token"
3. **Expiration** را تنظیم کنید: مدت زمان مناسب را انتخاب کنید (۹۰ روز توصیه می‌شود)
4. **Resource owner** را انتخاب کنید: حساب کاربری یا سازمان خود
5. **Repository access** را پیکربندی کنید:
   - برای دسترسی کامل **All repositories** را انتخاب کنید
   - یا **Only select repositories** برای دسترسی محدود

#### برای Classic Tokens:

1. روی **Generate new token** → **Generate new token (classic)** کلیک کنید
2. یک **Note** وارد کنید: مثلاً "Full Access Development Token"
3. **Expiration** را تنظیم کنید: مدت زمان مناسب را انتخاب کنید (۹۰ روز توصیه می‌شود)

### مرحله ۳: تنظیم مجوزهای توکن

#### مجوزهای ضروری برای دسترسی کامل گیت‌هاب

**همه** موارد زیر را برای دسترسی جامع انتخاب کنید:

##### دسترسی به مخازن (Repository Access)
- ✅ **repo** - کنترل کامل مخازن خصوصی
- ✅ **workflow** - به‌روزرسانی گردش‌کارهای GitHub Action
- ✅ **write:packages** - آپلود بسته‌ها به GitHub Package Registry
- ✅ **read:packages** - دانلود بسته‌ها از GitHub Package Registry
- ✅ **delete:packages** - حذف بسته‌ها از GitHub Package Registry

##### دسترسی مدیریتی (Administrative Access)
- ✅ **admin:org** - کنترل کامل سازمان‌ها
- ✅ **admin:public_key** - کنترل کامل کلیدهای عمومی کاربر
- ✅ **admin:repo_hook** - کنترل کامل هوک‌های مخزن
- ✅ **admin:org_hook** - کنترل کامل هوک‌های سازمان
- ✅ **admin:gpg_key** - کنترل کامل کلیدهای GPG کاربر
- ✅ **admin:ssh_signing_key** - کنترل کامل کلیدهای امضای SSH

##### Codespaces (ضروری برای توسعه)
- ✅ **codespace** - کنترل کامل codespaces
  - ایجاد و مدیریت محیط‌های توسعه
  - دسترسی به رازهای codespace
  - پیکربندی محیط‌های توسعه

##### Copilot (ضروری برای امکانات هوش مصنوعی)
- ✅ **copilot** - دسترسی به GitHub Copilot
  - مورد نیاز برای چت، تکمیل‌ها و عوامل Copilot
  - دسترسی به تمام امکانات Copilot Pro
  - پشتیبانی از افزونه‌ها و عوامل Copilot
  - دسترسی به مدل‌های مختلف هوش مصنوعی

##### اطلاعیه‌ها و داده‌های کاربر
- ✅ **notifications** - دسترسی به اطلاعیه‌ها
- ✅ **user** - به‌روزرسانی همه داده‌های کاربر
- ✅ **discussion** - خواندن و نوشتن بحث‌ها
- ✅ **project** - کنترل کامل پروژه‌ها
- ✅ **gist** - ایجاد gist

##### مجوزهای اضافی برای Fine-grained Tokens

در صورت استفاده از fine-grained tokens، موارد زیر را نیز فعال کنید:

**مجوزهای مخزن (Repository Permissions):**
- Actions: Read and write
- Administration: Read and write
- Checks: Read and write
- Code scanning alerts: Read and write
- Codespaces: Read and write
- Codespaces lifecycle admin: Read and write
- Codespaces metadata: Read and write
- Codespaces secrets: Read and write
- Commit statuses: Read and write
- Contents: Read and write
- Dependabot alerts: Read and write
- Dependabot secrets: Read and write
- Deployments: Read and write
- Discussions: Read and write
- Environments: Read and write
- Issues: Read and write
- Merge queues: Read and write
- Metadata: Read (اجباری)
- Pages: Read and write
- Projects: Read and write
- Pull requests: Read and write
- Secret scanning alerts: Read and write
- Secrets: Read and write
- Security events: Read and write
- Variables: Read and write
- Webhooks: Read and write
- Workflows: Read and write

**مجوزهای حساب (Account Permissions):**
- Copilot: Read and write
- Copilot Business: Read and write (در صورت وجود)
- Codespaces user secrets: Read and write
- Email addresses: Read
- Followers: Read and write
- GPG keys: Read and write
- Git SSH keys: Read and write
- SSH signing keys: Read and write
- Profile: Read
- Starring: Read and write

### مرحله ۴: ساخت و ذخیره توکن

1. به پایین اسکرول کنید و روی **Generate token** کلیک کنید
2. **فوراً توکن را کپی کنید** - دیگر نمی‌توانید آن را ببینید
3. آن را به صورت ایمن ذخیره کنید در:
   - مدیر رمز عبور (توصیه می‌شود)
   - فایل رمزگذاری شده
   - متغیر محیطی
   - سیستم مدیریت رازهای امن

## استفاده از توکن

### روش‌های احراز هویت

#### ۱. عملیات Git با HTTPS

هنگام درخواست رمز عبور، توکن را جایگزین کنید:

```bash
git clone https://github.com/username/repository.git
# Username: نام-کاربری-گیت‌هاب-شما
# Password: توکن-دسترسی-شخصی-شما
```

#### ۲. مدیر اعتبارنامه Git

پیکربندی Git برای استفاده از توکن:

```bash
# ذخیره دائمی اعتبارنامه‌ها
git config --global credential.helper store

# یا استفاده از کش (انقضا بعد از ۱ ساعت)
git config --global credential.helper 'cache --timeout=3600'

# اولین عملیات git برای اعتبارنامه‌ها درخواست می‌کند
git clone https://github.com/username/repository.git
# هنگام درخواست رمز عبور، توکن را وارد کنید
```

#### ۳. GitHub CLI

```bash
# احراز هویت با توکن
echo "your-token" | gh auth login --with-token

# تأیید احراز هویت
gh auth status
```

#### ۴. درخواست‌های API

```bash
# استفاده از curl
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# استفاده از GitHub REST API
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user/repos
```

#### ۵. متغیرهای محیطی

```bash
# Linux/macOS
export GITHUB_TOKEN="your-token"

# Windows PowerShell
$env:GITHUB_TOKEN="your-token"

# Windows Command Prompt
set GITHUB_TOKEN=your-token

# استفاده در اسکریپت‌ها
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

## یکپارچه‌سازی با GitHub Copilot Pro

با فعال‌سازی مجوزهای Copilot، می‌توانید به موارد زیر دسترسی داشته باشید:

### امکانات Copilot
- **تکمیل کد**: پیشنهادات کد با هوش مصنوعی
- **Copilot Chat**: دستیار هوش مصنوعی مکالمه‌ای
- **Copilot Agents**: عوامل هوش مصنوعی تخصصی برای وظایف مختلف
- **افزونه‌های Copilot**: عملکرد سفارشی Copilot
- **پشتیبانی چند مدل**: دسترسی به مدل‌های مختلف هوش مصنوعی

### استفاده از Copilot با توکن

```bash
# فعال‌سازی Copilot در VS Code
# Settings → Extensions → GitHub Copilot

# یا از طریق CLI
gh copilot status

# احراز هویت در صورت نیاز
gh auth refresh -s copilot
```

## یکپارچه‌سازی با GitHub Codespaces

با مجوزهای Codespaces، می‌توانید:

### امکانات Codespace
- ایجاد و مدیریت codespace‌ها
- دسترسی به رازهای codespace
- پیکربندی محیط‌های توسعه
- استفاده از مدیریت چرخه حیات codespace

### استفاده از Codespaces

```bash
# ایجاد codespace
gh codespace create --repo owner/repo

# لیست codespace‌ها
gh codespace list

# اتصال به codespace
gh codespace ssh --codespace name

# دسترسی به codespace در مرورگر
gh codespace code --codespace name --web
```

## MCP Server و Agents

### دسترسی به Model Context Protocol (MCP) Server

**MCP چیست؟**

Model Context Protocol (MCP) یک استاندارد باز است که به برنامه‌های هوش مصنوعی و ابزارها امکان می‌دهد به طور ایمن به منابع داده و سرویس‌های مختلف متصل شوند. سرورهای MCP به عنوان پل ارتباطی بین عوامل هوش مصنوعی (مانند GitHub Copilot) و سیستم‌های خارجی عمل می‌کنند و به هوش مصنوعی اجازه می‌دهند از طریق رابط‌های استاندارد شده به داده‌ها دسترسی پیدا کند و آن‌ها را دستکاری کند.

**یکپارچه‌سازی MCP با گیت‌هاب:**

با مجوزهای کامل توکن گیت‌هاب، سرورهای MCP می‌توانند:
- عوامل هوش مصنوعی را به مخازن و منابع گیت‌هاب متصل کنند
- به Copilot و سایر ابزارهای هوش مصنوعی امکان خواندن کد، مسائل و درخواست‌های pull را بدهند
- به عوامل هوش مصنوعی اجازه انجام عملیات گیت‌هاب از طرف شما را بدهند
- ارتباط ایمن بین سیستم‌های هوش مصنوعی و گیت‌هاب را تسهیل کنند

**نمونه‌های استفاده از MCP:**

```bash
# سرورهای MCP از توکن‌های گیت‌هاب برای دسترسی به منابع برای عوامل هوش مصنوعی استفاده می‌کنند
# توکن احراز هویت را برای عملیات سرور MCP فراهم می‌کند

# مثال ۱: سرور MCP که به داده‌های مخزن برای تحلیل هوش مصنوعی دسترسی دارد
# (این معمولاً توسط پیاده‌سازی‌های سرور MCP انجام می‌شود، نه فراخوانی مستقیم API)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/repos/owner/repo/contents/

# مثال ۲: افزونه‌های GitHub Copilot با استفاده از MCP
# افزونه‌های Copilot می‌توانند از سرورهای MCP برای دسترسی به داده‌های گیت‌هاب استفاده کنند
# توکن شما این افزونه‌ها را قادر می‌سازد با مخازن شما کار کنند

# مثال ۳: سرورهای MCP سفارشی
# می‌توانید سرورهای MCP بسازید که از توکن گیت‌هاب شما برای فراهم کردن
# دسترسی عوامل هوش مصنوعی به منابع گیت‌هاب شما استفاده کنند
```

**نکات مهم:**
- سرورهای MCP معمولاً توسط ابزارهای هوش مصنوعی و افزونه‌ها استفاده می‌شوند، نه مستقیماً توسط کاربران
- توکن گیت‌هاب شما به سرورهای MCP امکان احراز هویت با گیت‌هاب از طرف عوامل هوش مصنوعی را می‌دهد
- هنگام استفاده از افزونه‌های Copilot که از MCP استفاده می‌کنند، از مجوزهای توکن شما استفاده می‌کنند
- MCP یک روش ایمن و استاندارد برای تعامل هوش مصنوعی با گیت‌هاب فراهم می‌کند

### GitHub Agents

دسترسی به GitHub Agents امکان موارد زیر را فراهم می‌کند:
- گردش‌کارهای خودکار
- یکپارچه‌سازی CI/CD
- اسکریپت‌های اتوماسیون سفارشی
- یکپارچه‌سازی ابزارهای شخص ثالث

## بهترین شیوه‌های مدیریت توکن

### ۱. سازمان‌دهی توکن

برای موارد زیر توکن‌های جداگانه ایجاد کنید:
- گردش‌کارهای توسعه
- خطوط لوله CI/CD
- یکپارچه‌سازی‌های شخص ثالث
- اسکریپت‌های شخصی
- اتوماسیون تیمی

### ۲. چرخش توکن

```bash
# بررسی سن توکن
gh auth status

# ساخت توکن جدید قبل از انقضا
# به‌روزرسانی همه سرویس‌هایی که از توکن قدیمی استفاده می‌کنند
# لغو توکن قدیمی بعد از مهاجرت
```

### ۳. حسابرسی توکن

به طور منظم استفاده از توکن را بررسی کنید:
1. به **Settings** → **Developer settings** → **Personal access tokens** بروید
2. ستون **Last used** را بررسی کنید
3. توکن‌های استفاده نشده یا قدیمی را لغو کنید
4. مجوزهای توکن را در صورت نیاز به‌روزرسانی کنید

### ۴. نمونه‌های ذخیره‌سازی امن

#### استفاده از متغیرهای محیطی (Linux/macOS)

```bash
# به ~/.bashrc یا ~/.zshrc اضافه کنید
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# بارگذاری مجدد shell
source ~/.bashrc
```

#### استفاده از Pass (مدیر رمز عبور)

```bash
# ذخیره توکن
pass insert github/token

# بازیابی توکن
export GITHUB_TOKEN=$(pass show github/token)
```

#### استفاده از macOS Keychain

```bash
# ذخیره توکن
security add-generic-password -a "$USER" -s "github_token" -w "ghp_xxxx"

# بازیابی توکن
security find-generic-password -a "$USER" -s "github_token" -w
```

## عیب‌یابی

### توکن کار نمی‌کند

1. **تأیید مجوزهای توکن**:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
   ```

2. **بررسی انقضای توکن**:
   - به Settings → Developer settings → Personal access tokens بروید
   - تاریخ انقضا را بررسی کنید

3. **اطمینان از فرمت صحیح**:
   - توکن‌های Classic: پیشوند `ghp_`
   - توکن‌های Fine-grained: پیشوند `github_pat_`

### مجوزهای ناکافی

اگر خطای مجوز دریافت کردید:
1. محدوده‌های مورد نیاز برای عملیات را بررسی کنید
2. توکن را با محدوده‌های اضافی دوباره بسازید
3. توکن ذخیره شده در برنامه‌های خود را به‌روزرسانی کنید

## یکپارچه‌سازی با افزونه Remote SSH

هنگام استفاده از این افزونه Remote SSH با مخازن گیت‌هاب:

### ۱. کلون کردن مخازن

```bash
# اتصال به سرور راه دور از طریق SSH
# سپس کلون با استفاده از توکن
git clone https://YOUR_TOKEN@github.com/username/repo.git
```

### ۲. پیکربندی Git روی سرور راه دور

```bash
# SSH به سرور راه دور
# پیکربندی اعتبارنامه‌های git
git config --global credential.helper store
echo "https://YOUR_TOKEN:x-oauth-basic@github.com" > ~/.git-credentials
```

### ۳. استفاده از GitHub CLI روی سرور راه دور

```bash
# نصب GitHub CLI روی سرور راه دور
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# احراز هویت
echo "YOUR_TOKEN" | gh auth login --with-token
```

## منابع اضافی

- [مستندات GitHub: ساخت توکن دسترسی شخصی](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [مستندات GitHub CLI](https://cli.github.com/manual/)
- [مستندات GitHub REST API](https://docs.github.com/en/rest)
- [مستندات GitHub Copilot](https://docs.github.com/en/copilot)
- [مستندات GitHub Codespaces](https://docs.github.com/en/codespaces)

## پشتیبانی

برای مسائل مربوط به:
- **توکن‌های گیت‌هاب**: [پشتیبانی GitHub](https://support.github.com/)
- **این افزونه**: [مسائل مخزن](https://github.com/jajera/vsx-remote-ssh/issues)
- **Copilot**: [پشتیبانی GitHub Copilot](https://github.com/community/community/discussions/categories/copilot)
- **Codespaces**: [پشتیبانی Codespaces](https://github.com/community/community/discussions/categories/codespaces)

## مجوز

این مستندات بخشی از پروژه افزونه VSX Remote SSH است که تحت مجوز MIT منتشر شده است.

---

## راهنمای سریع فارسی

### خلاصه مراحل:
1. وارد [GitHub.com](https://github.com) شوید
2. Settings → Developer settings → Personal access tokens
3. Generate new token (classic یا Fine-grained)
4. همه مجوزها را انتخاب کنید (repo, workflow, admin:org, codespace, copilot, و غیره)
5. Generate token را بزنید
6. توکن را فوراً کپی کنید
7. در مکان امن ذخیره کنید (مدیر رمز عبور)
8. برای استفاده، توکن را به‌جای رمز عبور وارد کنید

### نکات مهم:
- ✅ همیشه توکن را در مکان امن ذخیره کنید
- ✅ برای هر منظور توکن جداگانه بسازید
- ✅ هر ۹۰ روز توکن را تغییر دهید
- ❌ هرگز توکن را در کد commit نکنید
- ❌ هرگز توکن را به اشتراک نگذارید

برای راهنمای کامل انگلیسی، فایل [GITHUB_TOKEN_SETUP.md](GITHUB_TOKEN_SETUP.md) را مطالعه کنید.
