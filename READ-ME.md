# CC20 Personal Project - RaanNong 🐾
![ER diagram](../back-end/src/assets/Project%20Ran%20Nong.drawio.png)

# 🐾 RaanNong | Pet E-commerce Platform

**"RaanNong หรือ ร้านน้อง"** คือระบบขายสินค้าเกี่ยวกับสัตว์เลี้ยงออนไลน์ ที่รองรับผู้ใช้งานหลากหลายประเภททั้ง Guest (ผู้ใช้ทั่วไป), User, Admin และ Owner พร้อมระบบรีวิวสินค้า ตะกร้าสินค้า คำสั่งซื้อ และแดชบอร์ดผู้ดูแลร้าน

---

## User Roles & Permissions

| Role  | สิทธิ์การใช้งานหลัก                               |
| ----- | -------------------------------------------- |
| Guest | ลงทะเบียน, เข้าชมสินค้า                          |
| User  | เพิ่มสัตว์เลี้ยง, สั่งซื้อสินค้า, รีวิวสินค้า                |
| Admin | จัดการสินค้า, รีวิว, ดึงข้อมูลสัตว์เลี้ยง, ดูคำสั่งซื้อทั้งหมด   |
| Owner | ทุกอย่างของ Admin + วิเคราะห์ยอดขาย + ใช้ AI Chat |

### ระบบมี Role-Based Access โดย Login แล้วระบบจะ redirect ไปยังหน้าเฉพาะตาม Role

---

## ER Diagram (Entity Relationship)

```
User ──┬── 1:1 ──> Cart ──┬── 1:N ──> CartItem ── N:1 ─ Product
       ├── 1:N ──> Pet
       ├── 1:N ──> Order ──┬── 1:N ──> OrderItem ── N:1 ─ Product
       ├── 1:N ──> Review ── N:1 ──> Product
       └── 1:N ──> AI_Chat_Log

Product ── 1:N ──> Promotion
```

* ผู้ใช้ 1 คน  ต่อ 1 ตะกร้าคำสั่งซื้อ (Cart) <span style="color:blue">{MAIN}</span>
* ผู้ใช้ 1 คน  สามารถมีได้หลายคำสั่งซื้อ (Order) <span style="color:blue">{MAIN}</span>
* ผู้ใช้ 1 คน  สามารถเพื่อสัตว์เลี้ยง <span style="color:red">{OPTION 1}</span> และรีวิว <span style="color:red">{OPTION 3}</span> ได้มากกว่า 1 ครั้ง (many)
* สินค้าสามารถถูกหยิบใส่ตะกร้า และสั่งซื้อโดยหลายคน
* Owner มีสิทธิ์เข้าถึง AI\_Chat\_Log เพื่อวิเคราะห์ข้อมูล <span style="color:red">{OPTION 2}</span>


---

## สิทธิ์ในแต่ละ Role

* **Owner**: เข้าถึงแดชบอร์ด, วิเคราะห์ยอดขาย, ใช้แชท AI
* **Admin**: จัดการสินค้า, รีวิว, โปรโมชัน
* **User**: สั่งซื้อสินค้า, เพิ่มสัตว์เลี้ยง, รีวิวสินค้า

---

## API Overview

### AUTH Path

| Method | Path                      | Auth | Description       | Body                      | Response                 |
| ------ | ------------------------- | ---- | ----------------- | ------------------------- | ------------------------ |
| POST   | /api/auth/register        | -    | สมัครสมาชิก         | { email, password, name } | { msg: "Welcome" }       |
| POST   | /api/auth/login           | -    | เข้าสู่ระบบ          | { email, password }       | { msg, accessToken }     |
| GET    | /api/auth/me              | USER | ดึงข้อมูลผู้ใช้         | -                         | { msg: "User", role }    |
| POST   | /api/forgot-password      | -    | ขอ reset password | { email }                 | { msg: "Link" }          |
| POST   | /api/reset-password/token | -    | reset password    | { password }              | { msg: "Reset success" } |

---

### Order & Order Items

| Method | Path                     | Auth  | Description            | Params / Body | Response                 |
| ------ | ------------------------ | ----- | ---------------------- | ------------- | ------------------------ |
| GET    | /api/orders              | ADMIN | ดึงคำสั่งซื้อทั้งหมด           | -             | { allOrders: [] }        |
| GET    | /api/orders/:id          | ADMIN | ดูคำสั่งซื้อเฉพาะรายการ      | id            | { order: {} }            |
| GET    | /api/orders/user/:userId | ADMIN | ดึง order ของ user นั้น ๆ | userId        | { orders: [] }           |
| POST   | /api/orders              | USER  | สร้างคำสั่งซื้อจากตะกร้า      | -             | { msg: "order created" } |

---

### 🛒 Cart & CartItem

| Method | Path                | Auth | Description       | Body / Params            | Response                  |
| ------ | ------------------- | ---- | ----------------- | ------------------------ | ------------------------- |
| GET    | /api/cart           | USER | ดูตะกร้าสินค้าทั้งหมด   | -                        | { cartItems: [] }         |
| POST   | /api/cart/items     | USER | เพิ่มสินค้าลงตะกร้า    | { product_id, quantity } | { msg: "add success" }    |
| PATCH  | /api/cart/items/:id | USER | แก้จำนวนสินค้าในตะกร้า | { quantity }             | { msg: "update success" } |
| DELETE | /api/cart/items/:id | USER | ลบสินค้าจากตะกร้า    | id                       | { msg: "delete success" } |

---

### PET Path <span style="color:red">{OPTION 1}</span>
| Method | Path         | Auth  | Description             | Body / Params                                           | Response                  |
| ------ | ------------ | ----- | ----------------------- | ------------------------------------------------------- | ------------------------- |
| GET    | /api/pets    | ADMIN | ดูสัตว์เลี้ยงทั้งหมดของทุก user | -                                                       | { allPet: [] }            |
| GET    | /api/pet/:id | ADMIN | ดูสัตว์เลี้ยงเฉพาะตัว (by ID) | id                                                      | { pet: {} }               |
| GET    | /api/my-pets | USER  | ดูเฉพาะสัตว์เลี้ยงของตัวเอง   | -                                                       | { myPets: [] }            |
| POST   | /api/pets    | USER  | เพิ่มสัตว์เลี้ยงใหม่           | { name, species, breed, birth_date, gender, image_url } | { msg: "create success" } |
| PUT    | /api/pet/:id | USER  | แก้ไขสัตว์เลี้ยงของตัวเอง     | { updated fields }                                      | { msg: "update success" } |
| DELETE | /api/pet/:id | USER  | ลบสัตว์เลี้ยงของตัวเอง       | id                                                      | { msg: "delete success" } |

---


### AI Chat (Owner Only) <span style="color:red">{OPTION 2}</span>

| Method | Path         | Auth  | Description            | Body                             | Response               |
| ------ | ------------ | ----- | ---------------------- | -------------------------------- | ---------------------- |
| GET    | /api/ai/chat | OWNER | ดึงประวัติการถาม-ตอบทั้งหมด | -                                | { logs: [] }           |
| POST   | /api/ai/chat | OWNER | ส่งคำถามและรับคำตอบจาก AI  | { question: "ควรลดราคาตัวไหนดี?" } | { ai_response: "..." } |


---

### Review Path <span style="color:red">{OPTION 3}</span>

| Method | Path             | Auth  | Description                | Body / Params                     |
| ------ | ---------------- | ----- | -------------------------- | --------------------------------- |
| POST   | /api/reviews     | USER  | สร้างรีวิวสินค้า                | { user_id, product_id, quantity } |
| GET    | /api/reviews     | -     | ดูรีวิวทั้งหมด (โดย guest/user) |
| DELETE | /api/reviews/:id | ADMIN | ลบรีวิวออกจากระบบ            | id                                |

---

### Promotion Path <span style="color:red">{OPTION 4}</span>

| Method | Path                | Auth  | Description    | Body / Params                           | Response                  |
| ------ | ------------------- | ----- | -------------- | --------------------------------------- | ------------------------- |
| POST   | /api/promotions     | ADMIN | สร้างโปรโมชันใหม่ | { product_id, title, discount_percent } | { msg: "create success" } |
| GET    | /api/promotions     | -     | ดูโปรโมชันทั้งหมด  | -                                       | { promotions: [] }        |
| DELETE | /api/promotions/:id | ADMIN | ลบโปรโมชัน      | id                                      | { msg: "delete success" } |

---

## User Flow (คร่าวๆ)

1. Guest → Register/Login
2. User → เพิ่มสัตว์เลี้ยง → เลือกสินค้า → หยิบใส่ตะกร้า → Checkout → Review
3. Admin → Login → จัดการสินค้า / รีวิว / Order
4. Owner → Dashboard → วิเคราะห์ยอดขาย → ใช้ AI

---

## UX/UI (Figma)
แนบ Link Figma Design: https://www.figma.com/proto/5naOHODkUG53iJxnFMXDyO/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%87---Lo-fi-Wireframe?node-id=3-23&p=f&t=OFqbEU2BmobMyZGG-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3%3A23

--- 

## Color code
* primary: '#FCE8D8'      
  * พื้นหลังหลัก อบอุ่นแบบน้ำตาลพีช
* accent: '#4B2E2B'       
  * สีข้อความหลัก / โลโก้
* secondary: '#A3B18A'    
  *  สีปุ่มเสริม / การ์ด
* light: '#DDEACF'       
  *  พื้นหลังบางส่วน / hover
* base: '#FFFDF9'          
  *  สีพื้น content หรือ section สว่าง
* cta: '#F9AFAE'         
  *  ปุ่ม CTA (เช่น “สั่งซื้อเลย”)

![alt text]([<src/assets/ChatGPT Image Jul 1, 2025, 09_02_19 PM.png>](https://www.figma.com/design/5naOHODkUG53iJxnFMXDyO/%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%87---Lo-fi-Wireframe?node-id=0-1&t=Dk2cuJNIeNZV1NwS-1))
<!-- ![alt text](<src/assets/ChatGPT Image Jul 1, 2025, 09_01_49 PM.png>) -->

<!-- ---

## 📌 หมายเหตุ

* ใช้ JWT Authentication
* รองรับการใช้งานทั้ง desktop และ mobile
* ออกแบบระบบให้พร้อมขยายในอนาคต (เช่น ระบบฝากสัตว์เลี้ยง / คอร์สฝึกสุนัข) -->

## Update Jun 29, 2025
#### สิ่งที่ต้องทำต่อ
> 1. ทำ Figma Lo-fi wireframe ให้ครบทุกหน้า:
- Landing Page
- Login / Register
- Product Catalog
- Product Detail
- Cart
- Checkout
- Dashboard (Admin)
- Add/Edit Product
- Add Pet Profile
- AI Chat (Owner)

> 2. เช็คความถูกต้องของ schema.prisma ที่คิดเอาไว้แล้ว + เพิ่ม Seed

> 3. เริ่มทำ API ตาม ไฟล์ README
   - Pre -> เช็คอีกครั้ง คร่าวๆ ก็ยังดี ว่า ปุ่มต่างๆ หน้าต่างๆ ใน Figma มี Api ครบมั้ย อะไรที่ตกหล่นไปมั้ย
   - เริ่มจาก Auth → Pet → Product → Cart → Order → AI Chat
   - เช็กว่าแต่ละ route:
     - Validate ข้อมูลด้วย yup หรืออื่นๆ
     - เช็ค Auth
     - ส่ง Response แบบมีมาตรฐาน
  
> 4. Frontend เริ่มต้น
- ใช้ Vite + React
- เชื่อม Auth ก่อน แล้วลองเรียก API ทีละตัว
- สร้างหน้า Product และ Cart เป็น priority

> 5. Deploy Backend + Frontend