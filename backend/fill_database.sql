USE techshop;

INSERT INTO categories (name, slug) VALUES
('Ноутбуки', 'notebooks'),
('Миші', 'mice'),
('Клавіатури', 'keyboards'),
('Килимки', 'mousepads'),
('Навушники', 'headphones'),
('Охолоджувальні підставки', 'cooling-pads')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO users (name, email, password_hash, phone, address, role) VALUES
('Адмін', 'admin@techshop.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+380501234567', 'Київ, вул. Хрещатик, 1', 'admin'),
('Іван Петренко', 'ivan@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+380501111111', 'Київ, вул. Шевченка, 10', 'customer'),
('Марія Коваленко', 'maria@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+380502222222', 'Львів, вул. Грушевського, 5', 'customer'),
('Олександр Сидоренко', 'oleksandr@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+380503333333', 'Одеса, вул. Дерибасівська, 20', 'customer')
ON DUPLICATE KEY UPDATE name=VALUES(name);

SET @cat_notebooks = (SELECT id FROM categories WHERE slug = 'notebooks');
SET @cat_mice = (SELECT id FROM categories WHERE slug = 'mice');
SET @cat_keyboards = (SELECT id FROM categories WHERE slug = 'keyboards');
SET @cat_mousepads = (SELECT id FROM categories WHERE slug = 'mousepads');
SET @cat_headphones = (SELECT id FROM categories WHERE slug = 'headphones');
SET @cat_cooling = (SELECT id FROM categories WHERE slug = 'cooling-pads');

INSERT INTO products (name, price, stock, brand, category_id, description, image) VALUES
('ASUS ROG Strix G16', 89999.00, 5, 'ASUS', @cat_notebooks, 'Потужний ігровий ноутбук з RTX 5070 Ti та Intel Core Ultra 7', 'rog_strix_g16.jpg'),
('Lenovo Legion Pro 5 16IRX8', 74999.00, 8, 'Lenovo', @cat_notebooks, 'Професійний ігровий ноутбук з RTX 4060 та Intel Core i9', 'legion_pro_5.jpg'),
('Logitech G502 HERO', 2499.00, 15, 'Logitech', @cat_mice, 'Ігрова миша з сенсором до 25600 DPI та 11 програмованими кнопками', 'g502_hero.jpg'),
('Razer DeathAdder V3 Pro Wireless', 4999.00, 12, 'Razer', @cat_mice, 'Бездротова ігрова миша з сенсором до 30000 DPI', 'deathadder_v3_pro_wireless.jpg'),
('SteelSeries Apex Pro', 8999.00, 10, 'SteelSeries', @cat_keyboards, 'Механічна клавіатура з регульованою точкою спрацювання OmniPoint', 'apex_pro.jpg'),
('HyperX Alloy Origins', 5999.00, 14, 'HyperX', @cat_keyboards, 'Механічна клавіатура з RGB підсвіткою та перемикачами HyperX', 'alloy_origins.jpg'),
('SteelSeries QcK Large', 899.00, 25, 'SteelSeries', @cat_mousepads, 'Великий килимок для миші з тканиною поверхнею', 'qck_large.jpg'),
('Razer Acari', 1299.00, 18, 'Razer', @cat_mousepads, 'Швидкісний килимок з надзвичайно низьким тертям', 'razer_acari.jpg'),
('HyperX Cloud Alpha', 3999.00, 20, 'HyperX', @cat_headphones, 'Ігрова гарнітура з двокамерною технологією та знімним мікрофоном', 'cloud_alpha.jpg'),
('Logitech G Pro X 2', 8999.00, 8, 'Logitech', @cat_headphones, 'Бездротова ігрова гарнітура для професійного кіберспорту', 'g_pro_x_2.jpg'),
('DeepCool N200', 1299.00, 22, 'DeepCool', @cat_cooling, 'Охолоджувальна підставка з вентилятором 140мм для ноутбуків до 15.6"', 'deepcool_n200.jpg'),
('Cooler Master Notepal X150R', 1499.00, 16, 'Cooler Master', @cat_cooling, 'Охолоджувальна підставка з RGB підсвіткою для ноутбуків до 17"', 'notepal_x150r.jpg'),
('AJAZZ AJ159 Pro', 1999.00, 30, 'AJAZZ', @cat_mice, 'Бездротова миша з високою точністю та ергономічним дизайном', 'ajazz_aj159_pro.jpg'),
('Logitech G435', 2999.00, 12, 'Logitech', @cat_headphones, 'Бездротові ігрові навушники з мікрофоном та RGB підсвіткою', 'logitech_g435.jpg')
ON DUPLICATE KEY UPDATE name=VALUES(name);

SET @user_admin = (SELECT id FROM users WHERE email = 'admin@techshop.com');
SET @user_ivan = (SELECT id FROM users WHERE email = 'ivan@example.com');
SET @user_maria = (SELECT id FROM users WHERE email = 'maria@example.com');

SET @prod_g502 = (SELECT id FROM products WHERE name = 'Logitech G502 HERO');
SET @prod_apex = (SELECT id FROM products WHERE name = 'SteelSeries Apex Pro');
SET @prod_cloud = (SELECT id FROM products WHERE name = 'HyperX Cloud Alpha');
SET @prod_rog = (SELECT id FROM products WHERE name = 'ASUS ROG Strix G16');
SET @prod_deathadder = (SELECT id FROM products WHERE name = 'Razer DeathAdder V3 Pro Wireless');

INSERT INTO orders (user_id, full_name, phone, email, delivery_address, total, status, created_at) VALUES
(@user_ivan, 'Іван Петренко', '+380501111111', 'ivan@example.com', 'Нова Пошта: Київ, вул. Шевченка, 10', 11498.00, 'completed', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(@user_maria, 'Марія Коваленко', '+380502222222', 'maria@example.com', 'Укрпошта: Львів, вул. Грушевського, 5', 8998.00, 'processing', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(@user_ivan, 'Іван Петренко', '+380501111111', 'ivan@example.com', 'Нова Пошта: Київ, вул. Шевченка, 10', 89999.00, 'new', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

SET @order1 = (SELECT id FROM orders WHERE total = 11498.00 LIMIT 1);
SET @order2 = (SELECT id FROM orders WHERE total = 8998.00 LIMIT 1);
SET @order3 = (SELECT id FROM orders WHERE total = 89999.00 LIMIT 1);

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(@order1, @prod_g502, 1, 2499.00),
(@order1, @prod_apex, 1, 8999.00),
(@order2, @prod_cloud, 1, 3999.00),
(@order2, @prod_deathadder, 1, 4999.00),
(@order3, @prod_rog, 1, 89999.00)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);

