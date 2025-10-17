// Mock data for demonstration purposes
const meetingSummaries = [
    {
        id: 1,
        title: "Reunião de Planejamento Q1 2025",
        date: "2025-01-15",
        project: "Projeto Alpha",
        decisions: [
            "Iniciar o desenvolvimento da funcionalidade X até o final de janeiro",
            "Contratar 2 novos desenvolvedores para o time de backend"
        ],
        responsible: [
            { name: "João Silva", task: "Desenvolvimento da funcionalidade X" },
            { name: "Maria Santos", task: "Recrutamento de novos desenvolvedores" }
        ],
        nextSteps: [
            { action: "Finalizar especificações técnicas", deadline: "2025-01-20" },
            { action: "Iniciar processo de recrutamento", deadline: "2025-01-18" }
        ]
    },
    {
        id: 2,
        title: "Reunião de Revisão de Sprint",
        date: "2025-01-10",
        project: "Projeto Beta",
        decisions: [
            "Adotar metodologia Scrum para o próximo sprint",
            "Implementar testes automatizados para todas as novas features"
        ],
        responsible: [
            { name: "Carlos Oliveira", task: "Configuração do Scrum" },
            { name: "Ana Costa", task: "Implementação de testes automatizados" }
        ],
        nextSteps: [
            { action: "Configurar ferramentas de Scrum", deadline: "2025-01-12" },
            { action: "Criar framework de testes", deadline: "2025-01-15" }
        ]
    },
    {
        id: 3,
        title: "Reunião de Alinhamento de Marketing",
        date: "2025-01-08",
        project: "Campanha Q1",
        decisions: [
            "Lançar campanha de marketing digital em fevereiro",
            "Aumentar orçamento de anúncios em 20%"
        ],
        responsible: [
            { name: "Paula Fernandes", task: "Planejamento da campanha digital" },
            { name: "Ricardo Almeida", task: "Ajuste de orçamento" }
        ],
        nextSteps: [
            { action: "Criar cronograma da campanha", deadline: "2025-01-12" },
            { action: "Aprovar aumento de orçamento", deadline: "2025-01-10" }
        ]
    }
];

// Function to render summary cards
function renderSummaries(summaries) {
    const container = document.getElementById('summaryCards');
    container.innerHTML = '';

    if (summaries.length === 0) {
        container.innerHTML = '<div class="no-results">Nenhum resultado encontrado</div>';
        return;
    }

    summaries.forEach(summary => {
        const card = document.createElement('div');
        card.className = 'summary-card';
        
        card.innerHTML = `
            <h3>${summary.title}</h3>
            <div class="meta">
                <span>📅 ${formatDate(summary.date)}</span>
                <span>📁 ${summary.project}</span>
            </div>
            
            <div class="section">
                <h4>Decisões:</h4>
                <ul>
                    ${summary.decisions.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h4>Responsáveis:</h4>
                <ul>
                    ${summary.responsible.map(r => `<li><strong>${r.name}:</strong> ${r.task}</li>`).join('')}
                </ul>
            </div>
            
            <div class="section">
                <h4>Próximos Passos:</h4>
                <ul>
                    ${summary.nextSteps.map(ns => `<li>${ns.action} até ${formatDate(ns.deadline)}</li>`).join('')}
                </ul>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Function to filter summaries
function filterSummaries() {
    const participantFilter = document.getElementById('filterParticipant').value.toLowerCase();
    const dateFilter = document.getElementById('filterDate').value;
    const projectFilter = document.getElementById('filterProject').value.toLowerCase();

    const filtered = meetingSummaries.filter(summary => {
        const matchesParticipant = !participantFilter || 
            summary.responsible.some(r => r.name.toLowerCase().includes(participantFilter));
        
        const matchesDate = !dateFilter || summary.date === dateFilter;
        
        const matchesProject = !projectFilter || 
            summary.project.toLowerCase().includes(projectFilter);

        return matchesParticipant && matchesDate && matchesProject;
    });

    renderSummaries(filtered);
}

// Event listeners
document.getElementById('filterParticipant').addEventListener('input', filterSummaries);
document.getElementById('filterDate').addEventListener('change', filterSummaries);
document.getElementById('filterProject').addEventListener('input', filterSummaries);

document.getElementById('clearFilters').addEventListener('click', () => {
    document.getElementById('filterParticipant').value = '';
    document.getElementById('filterDate').value = '';
    document.getElementById('filterProject').value = '';
    renderSummaries(meetingSummaries);
});

// Initial render
renderSummaries(meetingSummaries);

