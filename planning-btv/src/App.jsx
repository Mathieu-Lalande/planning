import { useState } from 'react';
import { useEvents } from './hooks/useEvents';
import { usePlanning } from './contexts/PlanningContext';
import { useConfirm } from './contexts/ConfirmContext';
import { Header } from './components/Header';
import { Timeline } from './components/Timeline';
import { Legend } from './components/Legend';
import { Controls } from './components/Controls';
import { EventModal } from './components/EventModal';
import { PlanningSettingsModal } from './components/PlanningSettingsModal';
import { PlanningTabs } from './components/PlanningTabs';

function App() {
  const { config, activePlanningId } = usePlanning();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents(activePlanningId);
  const { confirm } = useConfirm();

  const [modalOpen, setModalOpen]       = useState(false);
  const [modalType, setModalType]       = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleAddClick   = (type) => { setModalType(type); setEditingEvent(null); setModalOpen(true); };
  const handleEventClick = (event) => { setEditingEvent(event); setModalType(event.type); setModalOpen(true); };

  const handleEventDoubleClick = async (id) => {
    const ok = await confirm({
      title: 'Supprimer cet événement ?',
      message: 'Cette action est irréversible.',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (ok) deleteEvent(id);
  };

  const handleModalSave = (formData) => {
    if (editingEvent) updateEvent(editingEvent.id, formData);
    else addEvent({ type: modalType, ...formData });
    setModalOpen(false);
  };

  const handleModalDelete = async (id) => {
    const ok = await confirm({
      title: 'Supprimer cet événement ?',
      message: 'Cette action est irréversible.',
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (ok) {
      deleteEvent(id);
      setModalOpen(false);
    }
  };

  const handleCapture = async () => {
    try {
      const element = document.getElementById('planning-card');
      if (!element) { alert('Élément de planning non trouvé'); return; }
      const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2, logging: false });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `planning_btv_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la capture de l'écran");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-5">
      <Header onCapture={handleCapture} onSettings={() => setSettingsOpen(true)} />
      <PlanningTabs />
      <Timeline events={events} onEventClick={handleEventClick} onEventDoubleClick={handleEventDoubleClick} />
      <Controls onAddClick={handleAddClick} />
      <Legend />

      {modalOpen && (
        <EventModal
          event={editingEvent}
          type={modalType}
          onSave={handleModalSave}
          onDelete={handleModalDelete}
          onClose={() => setModalOpen(false)}
        />
      )}

      {settingsOpen && <PlanningSettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

export default App;
