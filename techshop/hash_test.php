<?php
echo 'admin: ' . password_hash('admin123', PASSWORD_DEFAULT) . "<br>";
echo 'user: '  . password_hash('user123', PASSWORD_DEFAULT) . "<br>";
