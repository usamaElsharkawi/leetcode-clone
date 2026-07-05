import { Lightbulb } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoSectionProps {
  form: UseFormReturn<any>;
}

export function AdditionalInfoSection({ form }: AdditionalInfoSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="bg-amber-50 dark:bg-amber-950/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ConstraintsField register={register} error={errors.constraints} />
        <HintsField register={register} />
        <EditorialField register={register} />
      </CardContent>
    </Card>
  );
}

interface ConstraintsFieldProps {
  register: UseFormReturn<any>["register"];
  error?: any;
}

function ConstraintsField({ register, error }: ConstraintsFieldProps) {
  return (
    <div>
      <Label className="font-medium">Constraints</Label>
      <Textarea
        {...register("constraints")}
        placeholder="Enter problem constraints"
        className="mt-2 min-h-24 resize-y font-mono"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}

interface FieldProps {
  register: UseFormReturn<any>["register"];
}

function HintsField({ register }: FieldProps) {
  return (
    <div>
      <Label className="font-medium">Hints (Optional)</Label>
      <Textarea
        {...register("hints")}
        placeholder="Enter hints for solving the problem"
        className="mt-2 min-h-24 resize-y"
      />
    </div>
  );
}

function EditorialField({ register }: FieldProps) {
  return (
    <div>
      <Label className="font-medium">Editorial (Optional)</Label>
      <Textarea
        {...register("editorial")}
        placeholder="Enter problem editorial/solution explanation"
        className="mt-2 min-h-32 resize-y"
      />
    </div>
  );
}