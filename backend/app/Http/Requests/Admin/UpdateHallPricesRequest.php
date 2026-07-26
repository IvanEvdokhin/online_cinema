<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHallPricesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'prices' => ['required', 'array', 'size:2'],
            'prices.*.seat_type' => ['required', 'in:standard,vip'],
            'prices.*.price' => ['required', 'integer', 'min:0', 'max:100000'],
        ];
    }
}
