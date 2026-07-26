<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHallLayoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rows' => ['required', 'integer', 'min:1', 'max:30'],
            'cols' => ['required', 'integer', 'min:1', 'max:30'],
            'seat_layout' => ['required', 'array'],
        ];
    }
}
