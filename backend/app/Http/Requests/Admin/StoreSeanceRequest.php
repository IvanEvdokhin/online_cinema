<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSeanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hall_id' => ['required', 'exists:halls,id'],
            'movie_id' => ['required', 'exists:movies,id'],
            'start_datetime' => ['required', 'date'],
        ];
    }
}
