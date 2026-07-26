<?php

namespace App\Services;

class HallLayoutService
{
    public static function emptyLayout(int $rows, int $cols): array
    {
        return array_fill(0, $rows, array_fill(0, $cols, 'disabled'));
    }

    public static function defaultLayout(int $rows, int $cols): array
    {
        $layout = self::emptyLayout($rows, $cols);

        for ($row = 0; $row < $rows; $row++) {
            for ($col = 0; $col < $cols; $col++) {
                $layout[$row][$col] = 'standard';
            }
        }

        return $layout;
    }

    public static function validateLayout(array $layout, int $rows, int $cols): bool
    {
        if (count($layout) !== $rows) {
            return false;
        }

        foreach ($layout as $row) {
            if (! is_array($row) || count($row) !== $cols) {
                return false;
            }

            foreach ($row as $cell) {
                if (! in_array($cell, ['standard', 'vip', 'disabled'], true)) {
                    return false;
                }
            }
        }

        return true;
    }
}
