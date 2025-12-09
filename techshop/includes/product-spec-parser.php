<?php

function renderProductSpecs(string $details, array $sectionNames): string
{
    $html = '';
    $lines = explode("\n", $details);

    foreach ($lines as $line) {
        $t = trim($line);

        if ($t === '') {
            $html .= "<br>";
            continue;
        }

        if (!str_contains($t, ':') && in_array($t, $sectionNames, true)) {
            $html .= '<p><strong class="section-title">' . htmlspecialchars($t) . '</strong></p>';
        }
        elseif (str_contains($t, ':')) {
            [$k, $v] = array_pad(explode(':', $t, 2), 2, '');
            $html .= '<p><strong class="item-title">' . htmlspecialchars($k) . ':</strong> ' . htmlspecialchars($v) . '</p>';
        }
        else {
            $html .= '<p>' . htmlspecialchars($t) . '</p>';
        }
    }

    return $html;
}
