import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Save, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Theme, WordPair, loadCustomThemes, saveCustomThemes, PREBUILT_THEMES } from "../lib/themes";

type ThemeEditorProps = {
  onBack: () => void;
};

export default function ThemeEditor({ onBack }: ThemeEditorProps) {
  const { toast } = useToast();
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setCustomThemes(loadCustomThemes());
  }, []);

  const handleCreateNew = () => {
    setEditingTheme({
      id: `custom-${crypto.randomUUID()}`,
      name: "",
      pairs: [{ wordA: "", wordB: "" }],
      isCustom: true
    });
  };

  const handleEdit = (theme: Theme) => {
    setEditingTheme(JSON.parse(JSON.stringify(theme))); // Deep copy
  };

  const handleDelete = (id: string) => {
    const newThemes = customThemes.filter(t => t.id !== id);
    setCustomThemes(newThemes);
    saveCustomThemes(newThemes);
    toast({ title: "Theme deleted" });
  };

  const handleSave = () => {
    if (!editingTheme) return;

    if (!editingTheme.name.trim()) {
      toast({ title: "Validation Error", description: "Theme name is required.", variant: "destructive" });
      return;
    }

    const validPairs = editingTheme.pairs.filter(p => p.wordA.trim() && p.wordB.trim());
    if (validPairs.length === 0) {
      toast({ title: "Validation Error", description: "At least one complete pair is required.", variant: "destructive" });
      return;
    }

    const themeToSave = { ...editingTheme, pairs: validPairs };
    
    let newThemes;
    if (customThemes.some(t => t.id === themeToSave.id)) {
      newThemes = customThemes.map(t => t.id === themeToSave.id ? themeToSave : t);
    } else {
      newThemes = [...customThemes, themeToSave];
    }

    setCustomThemes(newThemes);
    saveCustomThemes(newThemes);
    setEditingTheme(null);
    toast({ title: "Theme saved successfully" });
  };

  const updatePair = (index: number, field: 'wordA' | 'wordB', value: string) => {
    if (!editingTheme) return;
    const newPairs = [...editingTheme.pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setEditingTheme({ ...editingTheme, pairs: newPairs });
  };

  const addPair = () => {
    if (!editingTheme) return;
    setEditingTheme({
      ...editingTheme,
      pairs: [...editingTheme.pairs, { wordA: "", wordB: "" }]
    });
  };

  const removePair = (index: number) => {
    if (!editingTheme) return;
    setEditingTheme({
      ...editingTheme,
      pairs: editingTheme.pairs.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background" data-testid="theme-editor">
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-lg border-b border-primary/10 p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold uppercase tracking-wider">Themes</h1>
      </div>

      <div className="p-4 space-y-6 pb-32">
        {editingTheme ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-primary font-bold uppercase tracking-wider">Theme Name</Label>
              <Input 
                value={editingTheme.name}
                onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                placeholder="e.g. Video Games"
                className="h-14 text-xl bg-card border-primary/20"
                data-testid="input-theme-name"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-primary font-bold uppercase tracking-wider">Word Pairs</Label>
              <AnimatePresence>
                {editingTheme.pairs.map((pair, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 bg-card/50 p-2 rounded-xl border border-primary/10"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input 
                        value={pair.wordA}
                        onChange={(e) => updatePair(index, 'wordA', e.target.value)}
                        placeholder="Word A"
                        className="bg-background"
                        data-testid={`input-pair-${index}-a`}
                      />
                      <Input 
                        value={pair.wordB}
                        onChange={(e) => updatePair(index, 'wordB', e.target.value)}
                        placeholder="Word B"
                        className="bg-background"
                        data-testid={`input-pair-${index}-b`}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removePair(index)}
                      className="text-muted-foreground hover:text-destructive"
                      disabled={editingTheme.pairs.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button variant="outline" onClick={addPair} className="w-full border-dashed border-primary/30 text-primary">
                <Plus className="w-4 h-4 mr-2" /> Add Pair
              </Button>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-lg border-t border-primary/10">
              <div className="max-w-md mx-auto flex gap-4">
                <Button variant="outline" className="flex-1 h-14" onClick={() => setEditingTheme(null)}>Cancel</Button>
                <Button className="flex-1 h-14" onClick={handleSave} data-testid="button-save-theme">
                  <Save className="w-5 h-5 mr-2" /> Save Theme
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Custom Themes</h2>
                <Button size="sm" onClick={handleCreateNew} data-testid="button-create-theme">
                  <Plus className="w-4 h-4 mr-1" /> New
                </Button>
              </div>
              
              {customThemes.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-primary/20 bg-card/30">
                  <p className="text-muted-foreground mb-4">You haven't created any custom themes yet.</p>
                  <Button variant="outline" onClick={handleCreateNew}>Create your first theme</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {customThemes.map((theme) => (
                    <Card key={theme.id} className="bg-card/50 border-primary/20">
                      <CardHeader className="py-4 px-5 flex flex-row items-center justify-between space-y-0">
                        <div>
                          <CardTitle className="text-lg">{theme.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-1">{theme.pairs.length} pairs</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(theme)} data-testid={`button-edit-theme-${theme.id}`}>
                            <Pencil className="w-4 h-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(theme.id)} className="hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Prebuilt Themes</h2>
              <div className="grid gap-3 opacity-70">
                {PREBUILT_THEMES.map((theme) => (
                  <Card key={theme.id} className="bg-muted/30 border-primary/10">
                    <CardHeader className="py-4 px-5 flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-lg">{theme.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{theme.pairs.length} pairs</p>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
